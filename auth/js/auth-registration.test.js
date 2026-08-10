const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const AUTH_JS_SOURCE = fs.readFileSync(path.join(__dirname, 'auth.js'), 'utf8');

function loadAuth(initialStorage = {}, responseForAction = () => ({ ok: true, data: {} })) {
    const store = { ...initialStorage };
    const requests = [];
    const sandbox = {
        AUTH_CONFIG: { region: 'us-east-1', clientId: 'test-client', mode: 'cognito' },
        sessionStorage: {
            getItem: key => (key in store ? store[key] : null),
            setItem: (key, value) => { store[key] = String(value); },
            removeItem: key => { delete store[key]; }
        },
        fetch: async (url, options) => {
            const action = options.headers['X-Amz-Target'].split('.').pop();
            const request = { action, url, body: JSON.parse(options.body) };
            requests.push(request);
            const response = responseForAction(action, request);
            return {
                ok: response.ok,
                json: async () => response.data || {}
            };
        },
        atob: value => Buffer.from(value, 'base64').toString('binary'),
        console
    };

    vm.createContext(sandbox);
    vm.runInContext(AUTH_JS_SOURCE, sandbox, { filename: 'auth.js' });
    const Auth = vm.runInContext('Auth', sandbox);
    return { Auth, requests, store };
}

test('register.start sends normalized ClientMetadata and saves it for confirmation', async () => {
    const { Auth, requests, store } = loadAuth({}, action => {
        assert.equal(action, 'SignUp');
        return {
            ok: true,
            data: {
                Session: 'signup-session',
                CodeDeliveryDetails: { Destination: 'd***@example.com' }
            }
        };
    });
    await Auth.ready;

    const result = await Auth.register.start('dev@example.com', {
        campaign_code: ' scrumtuous-claude ',
        country: ' CA ',
        personality: ' scrumtuous ',
        empty_value: '   ',
        ignored_value: null
    });

    assert.equal(result.destination, 'd***@example.com');
    assert.deepEqual(requests[0].body.ClientMetadata, {
        campaign_code: 'scrumtuous-claude',
        country: 'CA',
        personality: 'scrumtuous'
    });

    const pending = JSON.parse(store.auth_pending);
    assert.deepEqual(pending.clientMetadata, requests[0].body.ClientMetadata);
});

test('register.confirm re-sends saved ClientMetadata to Cognito', async () => {
    const metadata = {
        campaign_code: 'scrumtuous-claude',
        country: 'CA',
        personality: 'scrumtuous'
    };
    const pending = JSON.stringify({
        kind: 'register',
        username: 'dev@example.com',
        email: 'dev@example.com',
        session: 'signup-session',
        clientMetadata: metadata
    });
    const { Auth, requests } = loadAuth({ auth_pending: pending }, action => {
        assert.equal(action, 'ConfirmSignUp');
        return {
            ok: false,
            data: { __type: 'CodeMismatchException', message: 'Invalid code' }
        };
    });
    await Auth.ready;

    await assert.rejects(Auth.register.confirm('123456'), error => error.code === 'INVALID_CODE');
    assert.deepEqual(requests[0].body.ClientMetadata, metadata);
});

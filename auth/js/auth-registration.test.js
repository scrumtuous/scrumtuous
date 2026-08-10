const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const AUTH_JS_SOURCE = fs.readFileSync(path.join(__dirname, 'auth.js'), 'utf8');

function loadAuth(initialStorage = {}, responseForAction = () => ({ ok: true, data: {} })) {
    const store = { ...initialStorage };
    const requests = [];
    const authEvents = [];
    let localStorageClears = 0;
    const pageWindow = {
        Event: class {
            constructor(type) {
                this.type = type;
            }
        },
        dispatchEvent: event => { authEvents.push(event.type); }
    };
    const sandbox = {
        AUTH_CONFIG: {
            region: 'us-east-1',
            userPoolId: 'us-east-1_HvASertkx',
            clientId: 'test-client',
            usernamePrefix: '',
            givenNameFallback: 'Student',
            mode: 'cognito'
        },
        crypto: {
            randomUUID: () => '00112233-4455-4677-8899-aabbccddeeff'
        },
        sessionStorage: {
            getItem: key => (key in store ? store[key] : null),
            setItem: (key, value) => { store[key] = String(value); },
            removeItem: key => { delete store[key]; }
        },
        localStorage: {
            clear: () => { localStorageClears += 1; }
        },
        window: pageWindow,
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
    return {
        Auth,
        requests,
        store,
        pageWindow,
        authEvents,
        localStorageClears: () => localStorageClears
    };
}

function jwt(payload) {
    return `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;
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
    assert.equal(requests[0].body.Username, '00112233445546778899aabbccddeeff');
    assert.notEqual(requests[0].body.Username, 'dev@example.com');
    assert.deepEqual(requests[0].body.UserAttributes, [
        { Name: 'email', Value: 'dev@example.com' },
        { Name: 'given_name', Value: 'Dev' }
    ]);
    assert.deepEqual(requests[0].body.ClientMetadata, {
        campaign_code: 'scrumtuous-claude',
        country: 'CA',
        personality: 'scrumtuous'
    });

    const pending = JSON.parse(store.auth_pending);
    assert.equal(pending.username, '00112233445546778899aabbccddeeff');
    assert.equal(pending.email, 'dev@example.com');
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
        username: 'internal-user-123',
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
    assert.equal(requests[0].body.Username, 'internal-user-123');
    assert.equal(requests[0].body.ForceAliasCreation, false);
    assert.equal(requests[0].body.Session, 'signup-session');
    assert.deepEqual(requests[0].body.ClientMetadata, metadata);
});

test('register.confirm exchanges the confirmation session using the email alias', async () => {
    const pending = JSON.stringify({
        kind: 'register',
        username: 'internal-user-123',
        email: 'dev@example.com',
        session: 'signup-session',
        clientMetadata: {}
    });
    const idToken = jwt({
        sub: 'user-sub-123',
        email: 'dev@example.com',
        email_verified: true,
        exp: Math.floor(Date.now() / 1000) + 3600
    });
    const { Auth, requests, store, localStorageClears } = loadAuth({ auth_pending: pending }, action => {
        if (action === 'ConfirmSignUp') {
            return { ok: true, data: { Session: 'confirmation-session' } };
        }

        assert.equal(action, 'InitiateAuth');
        return {
            ok: true,
            data: {
                AuthenticationResult: {
                    IdToken: idToken,
                    AccessToken: 'access-token',
                    RefreshToken: 'refresh-token'
                }
            }
        };
    });
    await Auth.ready;

    const result = await Auth.register.confirm('123456');

    assert.equal(requests[0].body.Username, 'internal-user-123');
    assert.equal(requests[1].body.AuthFlow, 'USER_AUTH');
    assert.equal(requests[1].body.AuthParameters.USERNAME, 'dev@example.com');
    assert.equal(requests[1].body.AuthParameters.PREFERRED_CHALLENGE, 'EMAIL_OTP');
    assert.equal(requests[1].body.Session, 'confirmation-session');
    assert.equal(result.authenticated, true);
    assert.equal(Auth.isAuthenticated(), true);
    assert.equal(store.auth_pending, undefined);
    assert.equal(localStorageClears(), 1);
});

test('sign-in completes the OTP challenge with Cognito canonical username', async () => {
    const idToken = jwt({
        sub: 'user-sub-123',
        email: 'dev@example.com',
        email_verified: true,
        exp: Math.floor(Date.now() / 1000) + 3600
    });
    const { Auth, requests, store, pageWindow, authEvents, localStorageClears } = loadAuth({}, action => {
        if (action === 'InitiateAuth') {
            return {
                ok: true,
                data: {
                    ChallengeName: 'EMAIL_OTP',
                    Session: 'signin-session',
                    ChallengeParameters: {
                        USERNAME: 'internal-user-123',
                        CODE_DELIVERY_DESTINATION: 'd***@example.com'
                    }
                }
            };
        }

        assert.equal(action, 'RespondToAuthChallenge');
        return {
            ok: true,
            data: {
                AuthenticationResult: {
                    IdToken: idToken,
                    AccessToken: 'access-token',
                    RefreshToken: 'refresh-token'
                }
            }
        };
    });
    await Auth.ready;

    const start = await Auth.signIn.start('DEV@EXAMPLE.COM');
    assert.equal(start.destination, 'd***@example.com');
    await Auth.signIn.confirm('123456');

    assert.equal(requests[0].body.AuthParameters.USERNAME, 'dev@example.com');
    assert.equal(requests[1].body.ChallengeResponses.USERNAME, 'internal-user-123');
    assert.equal(Auth.getUser().email, 'dev@example.com');
    assert.equal(pageWindow.Auth, Auth);
    assert.equal(pageWindow.currentUser.id_token, idToken);
    assert.equal(pageWindow.currentUser.access_token, 'access-token');
    assert.equal(pageWindow.currentUser.profile.email, 'dev@example.com');
    assert.equal(authEvents.includes('auth:changed'), true);
    assert.equal(store.auth_pending, undefined);
    assert.equal(localStorageClears(), 1);
});

test('authReady publishes a restored session for the exam application', async () => {
    const idToken = jwt({
        sub: 'restored-user-123',
        email: 'restored@example.com',
        email_verified: true,
        exp: Math.floor(Date.now() / 1000) + 3600
    });
    const seeded = {
        auth_user: JSON.stringify({
            userId: 'restored-user-123',
            email: 'restored@example.com',
            emailVerified: true
        }),
        auth_id_token: idToken,
        auth_access_token: 'restored-access-token',
        auth_refresh_token: 'restored-refresh-token'
    };
    const { Auth, pageWindow } = loadAuth(seeded);

    const readyUser = await pageWindow.authReady;

    assert.equal(pageWindow.authReady, Auth.ready);
    assert.equal(readyUser.id_token, idToken);
    assert.equal(readyUser.access_token, 'restored-access-token');
    assert.equal(pageWindow.currentUser, readyUser);
    assert.equal(pageWindow.currentUser.profile.sub, 'restored-user-123');
});

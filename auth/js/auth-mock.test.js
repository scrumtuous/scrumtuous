// Tests for the mock authentication path in auth.js (Auth.mockIn).
//
// Runs with Node's built-in test runner - no dependencies, no build step:
//   node --test
//
// auth.js is written as a plain browser script (no module.exports), so it's
// loaded here into a vm sandbox with stubbed browser globals rather than
// required/imported. This keeps auth.js itself completely unmodified for
// testing purposes.

const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const AUTH_JS_SOURCE = fs.readFileSync(path.join(__dirname, 'auth.js'), 'utf8');

function loadAuth(authConfig, initialStorage = {}) {
    const store = { ...initialStorage };
    let fetchCalls = 0;

    const sandbox = {
        AUTH_CONFIG: authConfig,
        sessionStorage: {
            getItem: (key) => (key in store ? store[key] : null),
            setItem: (key, value) => { store[key] = String(value); },
            removeItem: (key) => { delete store[key]; }
        },
        // A real Cognito call from a mock-auth code path is a bug - fail loud.
        fetch: async () => {
            fetchCalls += 1;
            return { ok: false, json: async () => ({}) };
        },
        atob: (value) => Buffer.from(value, 'base64').toString('binary'),
        console
    };
    vm.createContext(sandbox);
    vm.runInContext(AUTH_JS_SOURCE, sandbox, { filename: 'auth.js' });
    // Top-level `const` in a vm-run script binds in the context's lexical
    // scope, not as an own property of the sandbox object - fetch it back
    // with a second evaluation in that same context.
    const Auth = vm.runInContext('Auth', sandbox);

    return { Auth, store, fetchCalls: () => fetchCalls };
}

test('Auth.mockIn is absent when AUTH_CONFIG.mode is not "mock"', async () => {
    const { Auth } = loadAuth({ region: 'us-east-1', clientId: 'x', mode: 'cognito' });
    await Auth.ready;
    assert.equal(Auth.mockIn, undefined);
});

test('Auth.mockIn is absent when mode is unset entirely', async () => {
    const { Auth } = loadAuth({ region: 'us-east-1', clientId: 'x' });
    await Auth.ready;
    assert.equal(Auth.mockIn, undefined);
});

test('mockIn uses the provided email and stable dev user id', async () => {
    const { Auth, fetchCalls } = loadAuth({ region: 'us-east-1', clientId: 'x', mode: 'mock' });
    await Auth.ready;

    Auth.mockIn('dev@example.com');

    assert.equal(Auth.isAuthenticated(), true);
    // Individual field checks, not deepEqual: the user object is created
    // inside the vm sandbox's separate realm, so it doesn't share an
    // Object.prototype with plain object literals in this file.
    const user = Auth.getUser();
    assert.equal(user.userId, 'cameron-mckenzie-001');
    assert.equal(user.email, 'dev@example.com');
    assert.equal(user.emailVerified, true);
    assert.equal(typeof Auth.getAccessToken(), 'string');
    assert.equal(fetchCalls(), 0);
});

test('mockIn falls back to a safe default email when none is given', async () => {
    const { Auth } = loadAuth({ region: 'us-east-1', clientId: 'x', mode: 'mock' });
    await Auth.ready;

    Auth.mockIn('');

    assert.equal(Auth.getUser().email, 'visit@theseverside.com');
});

test('mockIn falls back to the default email for whitespace-only input', async () => {
    const { Auth } = loadAuth({ region: 'us-east-1', clientId: 'x', mode: 'mock' });
    await Auth.ready;

    Auth.mockIn('   ');

    assert.equal(Auth.getUser().email, 'visit@theseverside.com');
});

test('logout clears a mock session without contacting Cognito', async () => {
    const { Auth, fetchCalls } = loadAuth({ region: 'us-east-1', clientId: 'x', mode: 'mock' });
    await Auth.ready;

    Auth.mockIn('dev@example.com');
    await Auth.logout();

    assert.equal(Auth.isAuthenticated(), false);
    assert.equal(Auth.getUser(), null);
    assert.equal(fetchCalls(), 0);
});

test('a mock session restores on reload without contacting Cognito', async () => {
    const seeded = {
        auth_user: JSON.stringify({ userId: 'mock-user-001', email: 'dev@example.com', emailVerified: true }),
        auth_access_token: 'mock-access-token',
        auth_provider: 'mock'
    };
    const { Auth, fetchCalls } = loadAuth({ region: 'us-east-1', clientId: 'x', mode: 'mock' }, seeded);

    await Auth.ready;

    assert.equal(Auth.isAuthenticated(), true);
    assert.equal(Auth.getUser().email, 'dev@example.com');
    assert.equal(fetchCalls(), 0);
});

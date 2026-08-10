# Passwordless Auth Module

Minimal, isolated Cognito authentication for vanilla JavaScript applications. No framework coupling, no build step, no Hosted UI redirect - use it anywhere.

Sign-in and registration happen via Cognito's native **Email OTP** (one-time code) authentication, driven directly by `fetch` calls to the Cognito Identity Provider API. There is no OAuth redirect and no Cognito-hosted login page: the email + code form lives on your own site.

## Core Files (Copy These to Your App)

All auth logic lives in `auth/js/`, along with all other JavaScript in this project:

- **`auth/js/auth-config.js`** — Configuration only (region + client ID)
- **`auth/js/auth.js`** — Auth module (Cognito API calls, token/session management). Zero DOM manipulation.
- **`auth/js/auth-forms.js`** — Generic DOM wiring for a two-step (email → code) form. Binds to `data-register-*` / `data-signin-*` attributes; no styling or business logic of its own.

## Demo Files (Reference)

Shows how to use the auth module:

- **`index.html`** / **`auth/js/home.js`** — Home page: shows signed-in/signed-out state, links to Register/Sign In, Log Out button.
- **`auth/register.html`** — Two-step registration form (email → verification code).
- **`auth/login.html`** — Two-step sign-in form (email → verification code).
- **`assets/css/style.css`** — Basic styling for both.

## Quick Start

1. **Update config** in `auth/js/auth-config.js`:

```javascript
const AUTH_CONFIG = {
    region: 'us-east-1',
    clientId: 'your-app-client-id'
};
```

That's it — there's no redirect URI, logout URI, or Cognito domain to configure, since there's no redirect flow.

2. **Load the auth module** on any page that needs to know who's signed in:

```html
<script src="auth/js/auth-config.js"></script>
<script src="auth/js/auth.js"></script>
```

3. **Use it**:

```javascript
await Auth.ready; // resolves once any existing session is restored/validated

if (Auth.isAuthenticated()) {
    const user = Auth.getUser();
    console.log(user.email);
    console.log(user.userId);
}

// Sign out
await Auth.logout();

// Get access token for API calls
const token = Auth.getAccessToken();
```

4. **For a register or sign-in page**, load `auth-forms.js` too and use markup with the matching `data-*` attributes (copy `auth/register.html` or `auth/login.html` as a starting point):

```html
<script src="auth/js/auth-config.js"></script>
<script src="auth/js/auth.js"></script>
<script src="auth/js/auth-forms.js"></script>

<div data-auth-status hidden></div>

<div data-signin-email-step>
  <form data-signin-email-form>
    <input data-signin-email type="email" required>
    <button type="submit">Sign In</button>
  </form>
</div>

<div data-signin-code-step hidden>
  <p>Code sent to <strong data-signin-destination></strong></p>
  <form data-signin-code-form>
    <input data-signin-code type="text" required>
    <button type="submit">Verify and Continue</button>
  </form>
  <button type="button" data-signin-change>Change email</button>
  <button type="button" data-signin-resend>Resend code</button>
</div>
```

Use `register` instead of `signin` in the attribute names for the registration form. `auth-forms.js` only cares about attribute names, not any particular CSS framework — the reference pages here use plain CSS, but the same script works unmodified against a Bootstrap/Jekyll template using the same attributes.

## Auth Module API

### `Auth.ready`
A Promise that resolves once any session restored from `sessionStorage` has been validated (and silently refreshed via the refresh token if it had expired). Await this before checking auth state on page load.

### `Auth.isAuthenticated()`
Returns `true` if a valid session exists.

### `Auth.getUser()`
Returns a copy of the user object, or `null`:
```javascript
{
    userId: "sub-claim",           // Stable identifier
    email: "user@example.com",
    emailVerified: true/false
}
```

### `Auth.getAccessToken()`
Returns the bearer token for calling your own APIs.

### `Auth.logout()`
Async. Revokes tokens server-side (`GlobalSignOut`, best-effort) and clears the local session.

### `Auth.register.start(email)`
Async. Creates the user with a generated opaque Cognito username, stores the email as the user's email attribute/sign-in alias, and emails a verification code. Resolves to `{ destination, username, email }`. Throws on `EMAIL_IN_USE`, `INVALID_INPUT`, `TOO_MANY_ATTEMPTS`, `NETWORK_ERROR`.

### `Auth.register.confirm(code)`
Async. Verifies the code. If the pool allows it, this also signs the user in immediately (`{ authenticated: true }`); otherwise it transparently starts a normal sign-in (sending one more code) and resolves `{ authenticated: false }` so the caller can prompt for that second code using the same UI.

### `Auth.register.resend()`
Async. Resends the registration verification code. Resolves to `{ destination }`.

### `Auth.signIn.start(email)`
Async. Starts an email-code sign-in for an existing user. Resolves to `{ destination }`. Throws `SIGNIN_FAILED` if the account can't sign in this way.

### `Auth.signIn.confirm(code)`
Async. Verifies the code and, on success, establishes the session (`Auth.isAuthenticated()` becomes `true`).

### `Auth.signIn.resend()`
Async. Sends a fresh sign-in code. Resolves to `{ destination }`.

### `Auth.mockIn(email)`
Development only. **Only exists on the `Auth` object when `AUTH_CONFIG.mode === 'mock'`** — in any other configuration, including production, `Auth.mockIn` is `undefined`. Bypasses Cognito entirely and signs in a fake local user without any network call:

```javascript
{
    userId: "cameron-mckenzie-001",
    email: email || "visit@theseverside.com",  // falls back if empty/omitted
    emailVerified: true
}
```

Stores this the same way a real Cognito session is stored, so `Auth.isAuthenticated()`, `Auth.getUser()`, and `Auth.logout()` all work identically afterward — the rest of the app never needs to know the difference.

## Mock-In (Local Development)

To sign in without touching Cognito at all, set `mode: 'mock'` in `auth/js/auth-config.js`:

```javascript
const AUTH_CONFIG = {
    region: 'us-east-1',
    clientId: 'your-app-client-id',
    mode: 'mock'   // enables Auth.mockIn() and the Mock-In button
};
```

With that set, a **Mock-In** button appears on the register and sign-in pages (`auth/register.html`, `auth/login.html`), next to the normal submit button. Clicking it signs in immediately using whatever email is in the field (or the default `visit@theseverside.com` if it's empty) — no code, no Cognito call. Logout works the same as for a real session.

**Never set `mode: 'mock'` in a deployed environment.** There's no fallback/auto-detection here on purpose — mock mode requires an explicit, visible config change, so it can't accidentally ship because a Cognito setting was missing.

## Errors

All rejected Promises throw an error with a small, stable `.code` — never raw AWS exception names or token contents:

`EMAIL_IN_USE`, `INVALID_CODE`, `CODE_EXPIRED`, `TOO_MANY_ATTEMPTS`, `INVALID_INPUT`, `SIGNIN_FAILED`, `NETWORK_ERROR`, `NO_PENDING_REGISTRATION`, `NO_PENDING_SIGNIN`, `UNKNOWN`. `auth-forms.js` maps each to a user-facing message.

## Session Storage

- Uses `sessionStorage` (cleared when tab closes)
- Automatically restored and validated on page load via `Auth.ready`
- Expired sessions are silently refreshed using the refresh token when possible
- No sensitive data logged to console

## Security

- No Hosted UI redirect, no OAuth authorization code, no PKCE needed — email-code verification is Cognito's proof of identity for both registration and sign-in.
- No client secrets and no passwords are collected, generated, or shown; the pool's passwordless `SignUp` and `USER_AUTH` / `EMAIL_OTP` flows are used directly.
- Registration always generates an opaque Cognito username; email is used only as a sign-in alias, matching Cognito's internal identity model.
- HTTPS required.

## Deployment

1. Copy `auth/js/auth-config.js`, `auth/js/auth.js`, and `auth/js/auth-forms.js` to your app.
2. Copy `auth/register.html` and `auth/login.html` (or adapt their markup/attributes into your own templates).
3. Update `auth/js/auth-config.js` with your region, user pool ID, and app client ID. Make sure `mode` is `'cognito'` (or unset) in production.
4. Serve over HTTPS.

## Testing

The auth tests cover mock authentication, generated-username registration, confirmation-session exchange, and returning-user email OTP sign-in using Node's built-in test runner. There are no test dependencies or build step:

```
node --test auth/js/auth-mock.test.js auth/js/auth-registration.test.js
```

## Cache Invalidation

Do this to invalidate the cache:

aws cloudfront create-invalidation --distribution-id E3RVIU8BZIFWZE --paths "/index.html" "/auth/js/auth.js" "/auth/js/auth-config.js" "/auth/js/home.js" "/auth/js/auth-forms.js" "/auth/login.html" "/auth/register.html"
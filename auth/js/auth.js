// Authentication module - isolated, no DOM manipulation.
//
// Uses Cognito's native passwordless Email OTP sign-in (the USER_AUTH auth
// flow) by calling the Cognito Identity Provider API directly with fetch.
// There is no Hosted UI redirect and no OAuth callback page - registration
// and sign-in both happen in place on whatever page hosts the form.
const Auth = (() => {
    let user = null;
    let accessToken = null;

    class AuthError extends Error {
        constructor(code, message) {
            super(message || code);
            this.code = code;
        }
    }

    // --- Low-level Cognito Identity Provider API ----------------------------

    function mapAwsError(awsType) {
        switch (awsType) {
            case 'UsernameExistsException': return 'EMAIL_IN_USE';
            case 'CodeMismatchException': return 'INVALID_CODE';
            case 'ExpiredCodeException': return 'CODE_EXPIRED';
            case 'LimitExceededException':
            case 'TooManyRequestsException':
            case 'TooManyFailedAttemptsException': return 'TOO_MANY_ATTEMPTS';
            case 'InvalidParameterException':
            case 'InvalidEmailRoleAccessPolicyException': return 'INVALID_INPUT';
            case 'NotAuthorizedException':
            case 'UserNotFoundException': return 'SIGNIN_FAILED';
            default: return 'UNKNOWN';
        }
    }

    async function cognito(action, body) {
        let response;
        try {
            response = await fetch(`https://cognito-idp.${AUTH_CONFIG.region}.amazonaws.com/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-amz-json-1.1',
                    'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`
                },
                body: JSON.stringify(body)
            });
        } catch (e) {
            throw new AuthError('NETWORK_ERROR', 'Could not reach the authentication service.');
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const awsType = (data.__type || '').split('#').pop();
            throw new AuthError(mapAwsError(awsType), data.message);
        }

        return data;
    }

    // --- helpers -------------------------------------------------------------

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    function isExpired(idToken) {
        const payload = idToken && parseJwt(idToken);
        if (!payload || !payload.exp) return true;
        return Date.now() >= payload.exp * 1000 - 30000;
    }

    function setSession(result) {
        const payload = parseJwt(result.IdToken);
        user = {
            userId: payload.sub,
            email: payload.email,
            emailVerified: payload.email_verified || false
        };
        accessToken = result.AccessToken;

        sessionStorage.setItem('auth_user', JSON.stringify(user));
        sessionStorage.setItem('auth_access_token', accessToken);
        sessionStorage.setItem('auth_id_token', result.IdToken);
        if (result.RefreshToken) sessionStorage.setItem('auth_refresh_token', result.RefreshToken);
    }

    function clearSession() {
        ['auth_user', 'auth_access_token', 'auth_id_token', 'auth_refresh_token', 'auth_provider', 'auth_pending']
            .forEach(key => sessionStorage.removeItem(key));
        user = null;
        accessToken = null;
    }

    function savePending(data) {
        sessionStorage.setItem('auth_pending', JSON.stringify(data));
    }

    function loadPending(kind) {
        try {
            const pending = JSON.parse(sessionStorage.getItem('auth_pending'));
            return pending && pending.kind === kind ? pending : null;
        } catch (e) {
            return null;
        }
    }

    function clearPending() {
        sessionStorage.removeItem('auth_pending');
    }

    async function refreshSession() {
        const stored = sessionStorage.getItem('auth_refresh_token');
        if (!stored) return false;
        try {
            const data = await cognito('InitiateAuth', {
                AuthFlow: 'REFRESH_TOKEN_AUTH',
                ClientId: AUTH_CONFIG.clientId,
                AuthParameters: { REFRESH_TOKEN: stored }
            });
            setSession(data.AuthenticationResult);
            return true;
        } catch (e) {
            return false;
        }
    }

    async function restoreSession() {
        const stored = sessionStorage.getItem('auth_user');
        if (!stored) return;

        try {
            user = JSON.parse(stored);
        } catch (e) {
            clearSession();
            return;
        }
        accessToken = sessionStorage.getItem('auth_access_token');

        // Mock sessions have no Cognito JWT to expire/refresh - restoring one
        // is just restoring the locally-stored user as-is.
        if (sessionStorage.getItem('auth_provider') === 'mock') return;

        if (isExpired(sessionStorage.getItem('auth_id_token'))) {
            const refreshed = await refreshSession();
            if (!refreshed) clearSession();
        }
    }

    // --- registration ----------------------------------------------------------
    //
    // Requires the pool's UsernameAttributes to include email, so the raw
    // email can be used directly as Cognito's Username (no password, no
    // separate opaque username/alias). A pool without that setting rejects
    // SignUp with InvalidParameterException ("Username cannot be of email
    // format...").

    function normalizeClientMetadata(metadata) {
        if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return {};

        const normalized = {};
        for (const [key, rawValue] of Object.entries(metadata)) {
            if (!key || rawValue === null || rawValue === undefined) continue;
            const value = String(rawValue).trim();
            if (value) normalized[key] = value;
        }
        return normalized;
    }

    async function registerStart(email, clientMetadata = {}) {
        const metadata = normalizeClientMetadata(clientMetadata);
        const request = {
            ClientId: AUTH_CONFIG.clientId,
            Username: email,
            UserAttributes: [
                { Name: 'email', Value: email }
            ]
        };

        if (Object.keys(metadata).length) {
            request.ClientMetadata = metadata;
        }

        const data = await cognito('SignUp', request);

        savePending({
            kind: 'register',
            username: email,
            email,
            session: data.Session || null,
            clientMetadata: metadata
        });

        const destination = (data.CodeDeliveryDetails && data.CodeDeliveryDetails.Destination) || email;
        return { destination };
    }

    async function registerConfirm(code) {
        const pending = loadPending('register');
        if (!pending) throw new AuthError('NO_PENDING_REGISTRATION', 'Start registration again.');

        const request = {
            ClientId: AUTH_CONFIG.clientId,
            Username: pending.username,
            ConfirmationCode: code,
            Session: pending.session || undefined
        };

        const metadata = normalizeClientMetadata(pending.clientMetadata);
        if (Object.keys(metadata).length) {
            request.ClientMetadata = metadata;
        }

        const data = await cognito('ConfirmSignUp', request);

        // Some pool configurations let a fresh Session from ConfirmSignUp be
        // exchanged directly for tokens, signing the user in without a
        // second code. If that isn't honored, fall back to a normal sign-in,
        // which will send one more code.
        if (data.Session) {
            try {
                const authData = await cognito('InitiateAuth', {
                    AuthFlow: 'USER_AUTH',
                    ClientId: AUTH_CONFIG.clientId,
                    AuthParameters: { USERNAME: pending.username },
                    Session: data.Session
                });
                if (authData.AuthenticationResult) {
                    setSession(authData.AuthenticationResult);
                    clearPending();
                    return { authenticated: true };
                }
            } catch (e) {
                // fall through to standalone sign-in below
            }
        }

        clearPending();
        await signInStart(pending.email);
        return { authenticated: false };
    }

    async function registerResend() {
        const pending = loadPending('register');
        if (!pending) throw new AuthError('NO_PENDING_REGISTRATION', 'Start registration again.');

        const data = await cognito('ResendConfirmationCode', {
            ClientId: AUTH_CONFIG.clientId,
            Username: pending.username
        });

        const destination = (data.CodeDeliveryDetails && data.CodeDeliveryDetails.Destination) || pending.email;
        return { destination };
    }

    // --- sign-in -----------------------------------------------------------

    async function signInStart(email) {
        let data = await cognito('InitiateAuth', {
            AuthFlow: 'USER_AUTH',
            ClientId: AUTH_CONFIG.clientId,
            AuthParameters: { USERNAME: email, PREFERRED_CHALLENGE: 'EMAIL_OTP' }
        });

        // Defensive: some pool configurations respond with SELECT_CHALLENGE
        // first even when a preferred challenge is supplied up front.
        if (data.ChallengeName === 'SELECT_CHALLENGE') {
            data = await cognito('RespondToAuthChallenge', {
                ClientId: AUTH_CONFIG.clientId,
                ChallengeName: 'SELECT_CHALLENGE',
                ChallengeResponses: { USERNAME: email, ANSWER: 'EMAIL_OTP' },
                Session: data.Session
            });
        }

        if (data.ChallengeName !== 'EMAIL_OTP') {
            throw new AuthError('SIGNIN_FAILED', 'Email code sign-in is not available for this account.');
        }

        savePending({ kind: 'signin', email, session: data.Session });

        const params = data.ChallengeParameters || {};
        return { destination: params.CODE_DELIVERY_DESTINATION || email };
    }

    async function signInConfirm(code) {
        const pending = loadPending('signin');
        if (!pending) throw new AuthError('NO_PENDING_SIGNIN', 'Start sign-in again.');

        const data = await cognito('RespondToAuthChallenge', {
            ClientId: AUTH_CONFIG.clientId,
            ChallengeName: 'EMAIL_OTP',
            ChallengeResponses: { USERNAME: pending.email, EMAIL_OTP_CODE: code },
            Session: pending.session
        });

        if (!data.AuthenticationResult) {
            throw new AuthError('SIGNIN_FAILED', 'Sign-in did not complete.');
        }

        setSession(data.AuthenticationResult);
        clearPending();
    }

    async function signInResend() {
        const pending = loadPending('signin');
        if (!pending) throw new AuthError('NO_PENDING_SIGNIN', 'Start sign-in again.');
        return signInStart(pending.email);
    }

    // --- mock authentication (development only) -------------------------------
    //
    // Bypasses Cognito entirely and produces the same session shape used by
    // a real sign-in, so nothing outside this module needs to know which
    // path was used. Only reachable when AUTH_CONFIG.mode === 'mock': the
    // public interface below omits this function entirely otherwise, so it
    // isn't just disabled in production, it doesn't exist.

    function mockIn(email) {
        const resolvedEmail = (email || '').trim() || 'visit@theseverside.com';
        user = {
            userId: 'cameron-mckenzie-001',
            email: resolvedEmail,
            emailVerified: true
        };
        accessToken = 'mock-access-token';

        sessionStorage.setItem('auth_user', JSON.stringify(user));
        sessionStorage.setItem('auth_access_token', accessToken);
        sessionStorage.setItem('auth_provider', 'mock');
        clearPending();
    }

    // --- public interface ----------------------------------------------------

    return {
        // Resolves once any restored session has been validated (and
        // silently refreshed if it had expired). Await this before checking
        // isAuthenticated()/getUser() on page load.
        ready: restoreSession(),

        isAuthenticated() {
            return user !== null;
        },

        getUser() {
            return user ? { ...user } : null;
        },

        getAccessToken() {
            return accessToken;
        },

        async logout() {
            const token = accessToken;
            const wasMock = sessionStorage.getItem('auth_provider') === 'mock';
            clearSession();
            if (token && !wasMock) {
                try {
                    await cognito('GlobalSignOut', { AccessToken: token });
                } catch (e) {
                    // best effort; local session is already cleared
                }
            }
        },

        register: {
            start: registerStart,
            confirm: registerConfirm,
            resend: registerResend
        },

        signIn: {
            start: signInStart,
            confirm: signInConfirm,
            resend: signInResend
        },

        ...(AUTH_CONFIG.mode === 'mock' ? { mockIn } : {})
    };
})();

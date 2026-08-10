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
        constructor(code, message, awsType = '') {
            super(message || code);
            this.code = code;
            this.awsType = awsType;
        }
    }

    // --- Low-level Cognito Identity Provider API ----------------------------

    function mapAwsError(awsType) {
        switch (awsType) {
            case 'UsernameExistsException': return 'EMAIL_IN_USE';
            case 'AliasExistsException': return 'EMAIL_IN_USE';
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
            throw new AuthError(mapAwsError(awsType), data.message, awsType);
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

    function setSession(result, clearLocal = false) {
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
        // Optionally clear all localStorage when an explicit sign-in/register
        // completed. This keeps sessionStorage (the auth session) intact.
        if (clearLocal) {
            try {
                localStorage.clear();
            } catch (e) {
                // ignore environments without localStorage
            }
        }
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

    function normalizeEmail(value) {
        return typeof value === 'string' ? value.trim().toLowerCase() : '';
    }

    function assertEmail(email) {
        if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new AuthError('INVALID_INPUT', 'Enter a valid email address.');
        }
    }

    function generateInternalUsername() {
        let randomValue = '';
        const cryptoApi = typeof crypto !== 'undefined' ? crypto : null;

        if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
            randomValue = cryptoApi.randomUUID().replace(/-/g, '');
        } else if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
            const bytes = new Uint8Array(16);
            cryptoApi.getRandomValues(bytes);
            randomValue = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
        } else {
            randomValue = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
        }

        return `${AUTH_CONFIG.usernamePrefix || ''}${randomValue}`;
    }

    function deriveGivenName(email) {
        const localPart = email.split('@')[0] || '';
        const candidate = localPart.split(/[._+\-]+/).find(part => /[a-z]/i.test(part)) || '';
        const cleaned = candidate.replace(/[^a-z0-9'-]/gi, '').slice(0, 64);

        if (!cleaned) return AUTH_CONFIG.givenNameFallback || 'Student';
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }

    async function registerStart(rawEmail, clientMetadata = {}) {
        const email = normalizeEmail(rawEmail);
        assertEmail(email);
        const metadata = normalizeClientMetadata(clientMetadata);
        let lastCollisionError = null;

        for (let attempt = 0; attempt < 3; attempt += 1) {
            const username = generateInternalUsername();
            const givenName = deriveGivenName(email);
            const request = {
                ClientId: AUTH_CONFIG.clientId,
                Username: username,
                UserAttributes: [
                    { Name: 'email', Value: email },
                    { Name: 'given_name', Value: givenName }
                ]
            };

            if (Object.keys(metadata).length) {
                request.ClientMetadata = metadata;
            }

            try {
                const data = await cognito('SignUp', request);

                savePending({
                    kind: 'register',
                    username,
                    email,
                    givenName,
                    session: data.Session || null,
                    clientMetadata: metadata
                });

                const destination = (data.CodeDeliveryDetails && data.CodeDeliveryDetails.Destination) || email;
                return { destination, username, email };
            } catch (e) {
                if (e.awsType === 'UsernameExistsException') {
                    lastCollisionError = e;
                    continue;
                }
                throw e;
            }
        }

        throw lastCollisionError || new AuthError('UNKNOWN', 'Unable to generate a unique username.');
    }

    async function registerConfirm(code) {
        const pending = loadPending('register');
        if (!pending) throw new AuthError('NO_PENDING_REGISTRATION', 'Start registration again.');

        const request = {
            ClientId: AUTH_CONFIG.clientId,
            Username: pending.username,
            ConfirmationCode: code,
            ForceAliasCreation: false,
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
            const authData = await cognito('InitiateAuth', {
                AuthFlow: 'USER_AUTH',
                ClientId: AUTH_CONFIG.clientId,
                AuthParameters: {
                    USERNAME: pending.email,
                    PREFERRED_CHALLENGE: 'EMAIL_OTP'
                },
                Session: data.Session
            });
            if (authData.AuthenticationResult) {
                // This path is reached as part of an explicit registration
                // confirmation that yields tokens; clear localStorage now.
                setSession(authData.AuthenticationResult, true);
                clearPending();
                return { authenticated: true };
            }
        }

        clearPending();
        const signIn = await signInStart(pending.email);
        return { authenticated: signIn.authenticated === true };
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

    async function signInStart(rawEmail) {
        const email = normalizeEmail(rawEmail);
        assertEmail(email);
        let data = await cognito('InitiateAuth', {
            AuthFlow: 'USER_AUTH',
            ClientId: AUTH_CONFIG.clientId,
            AuthParameters: { USERNAME: email, PREFERRED_CHALLENGE: 'EMAIL_OTP' }
        });

        // Defensive: some pool configurations respond with SELECT_CHALLENGE
        // first even when a preferred challenge is supplied up front.
        if (data.AuthenticationResult) {
            setSession(data.AuthenticationResult, true);
            clearPending();
            return { authenticated: true, destination: email };
        }

        if (data.ChallengeName === 'SELECT_CHALLENGE' ||
            (!data.ChallengeName && Array.isArray(data.AvailableChallenges) && data.AvailableChallenges.includes('EMAIL_OTP'))) {
            data = await cognito('RespondToAuthChallenge', {
                ClientId: AUTH_CONFIG.clientId,
                ChallengeName: 'SELECT_CHALLENGE',
                ChallengeResponses: { USERNAME: email, ANSWER: 'EMAIL_OTP' },
                Session: data.Session
            });
        }

        if (data.AuthenticationResult) {
            setSession(data.AuthenticationResult, true);
            clearPending();
            return { authenticated: true, destination: email };
        }

        if (data.ChallengeName !== 'EMAIL_OTP') {
            throw new AuthError('SIGNIN_FAILED', 'Email code sign-in is not available for this account.');
        }

        const params = data.ChallengeParameters || {};
        savePending({
            kind: 'signin',
            email,
            challengeUsername: params.USERNAME || email,
            session: data.Session
        });

        return { authenticated: false, destination: params.CODE_DELIVERY_DESTINATION || email };
    }

    async function signInConfirm(code) {
        const pending = loadPending('signin');
        if (!pending) throw new AuthError('NO_PENDING_SIGNIN', 'Start sign-in again.');

        const data = await cognito('RespondToAuthChallenge', {
            ClientId: AUTH_CONFIG.clientId,
            ChallengeName: 'EMAIL_OTP',
            ChallengeResponses: {
                USERNAME: pending.challengeUsername || pending.email,
                EMAIL_OTP_CODE: code
            },
            Session: pending.session
        });

        if (!data.AuthenticationResult) {
            throw new AuthError('SIGNIN_FAILED', 'Sign-in did not complete.');
        }

        // Explicit sign-in completed; clear localStorage.
        setSession(data.AuthenticationResult, true);
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
        // Tests and the mock sign-in flow should mirror the real behavior
        // of clearing localStorage after an explicit sign-in.
        try {
            localStorage.clear();
        } catch (e) {
            // ignore environments without localStorage
        }
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

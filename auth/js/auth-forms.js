// Wires a Register or Sign-in HTML form to Auth.register.* / Auth.signIn.*.
//
// Expects markup using data-register-* or data-signin-* attributes (see
// auth/register.html and auth/login.html for the reference markup). This
// file contains DOM wiring only - no Cognito calls happen here directly,
// they all go through auth.js.
(function () {
    const ERROR_MESSAGES = {
        EMAIL_IN_USE: 'That email is already registered. Try signing in instead.',
        INVALID_CODE: 'That code is incorrect. Please try again.',
        CODE_EXPIRED: 'That code has expired. Request a new one.',
        TOO_MANY_ATTEMPTS: 'Too many attempts. Please wait a bit and try again.',
        INVALID_INPUT: 'Please check your email address and try again.',
        SIGNIN_FAILED: 'We could not sign you in with that email.',
        NETWORK_ERROR: 'Could not reach the authentication service. Check your connection.',
        NO_PENDING_REGISTRATION: 'Please enter your email again to continue.',
        NO_PENDING_SIGNIN: 'Please enter your email again to continue.',
        UNKNOWN: 'Something went wrong. Please try again.'
    };

    function friendlyError(err) {
        return ERROR_MESSAGES[err && err.code] || ERROR_MESSAGES.UNKNOWN;
    }

    function clean(value) {
        return typeof value === 'string' ? value.trim() : '';
    }

    function safeUrl(value) {
        try {
            return value ? new URL(value, window.location.href) : null;
        } catch (e) {
            return null;
        }
    }

    function trackingUrl(value) {
        const url = safeUrl(value);
        if (!url) return '';

        ['email', 'code', 'otp', 'token', 'access_token', 'id_token']
            .forEach(name => url.searchParams.delete(name));
        url.hash = '';
        return url.href;
    }

    function firstNonEmpty(...values) {
        for (const value of values) {
            const cleaned = clean(value);
            if (cleaned) return cleaned;
        }
        return '';
    }

    function queryValue(name, currentUrl, referrerUrl) {
        return firstNonEmpty(
            currentUrl && currentUrl.searchParams.get(name),
            referrerUrl && referrerUrl.searchParams.get(name)
        );
    }

    function hiddenValue(form, selector) {
        const element = form.querySelector(selector);
        return clean(element && element.value);
    }

    function browserLocale() {
        return firstNonEmpty(
            navigator.language,
            Array.isArray(navigator.languages) && navigator.languages[0]
        );
    }

    function inferCountryFromLocale(locale) {
        if (!locale) return '';

        try {
            if (typeof Intl.Locale === 'function') {
                return clean(new Intl.Locale(locale).region).toUpperCase();
            }
        } catch (e) {
            // Fall through to the language-region parser below.
        }

        const match = locale.match(/[-_]([A-Za-z]{2}|[0-9]{3})(?:$|[-_])/);
        return match ? match[1].toUpperCase() : '';
    }

    function browserTimezone() {
        try {
            return clean(Intl.DateTimeFormat().resolvedOptions().timeZone);
        } catch (e) {
            return '';
        }
    }

    function compactMetadata(values) {
        const result = {};
        for (const [key, rawValue] of Object.entries(values)) {
            if (rawValue === null || rawValue === undefined) continue;
            const value = String(rawValue).trim();
            if (value) result[key] = value;
        }
        return result;
    }

    function buildRegistrationContext(form) {
        const currentUrl = safeUrl(window.location.href);
        const referrerUrl = safeUrl(document.referrer);
        const locale = browserLocale();
        const queryCountry = queryValue('country', currentUrl, referrerUrl);
        const countryDefault = hiddenValue(form, '[data-register-country]');
        const inferredCountry = inferCountryFromLocale(locale);
        const country = firstNonEmpty(queryCountry, countryDefault, inferredCountry).toUpperCase();
        const countrySource = queryCountry
            ? 'url_query'
            : (countryDefault ? 'form_default' : (inferredCountry ? 'browser_locale' : ''));
        const consent = form.querySelector('[data-register-consent]');

        const campaignCode = firstNonEmpty(
            queryValue('campaign_code', currentUrl, referrerUrl),
            queryValue('campaign', currentUrl, referrerUrl),
            hiddenValue(form, '[data-register-campaign-code]')
        );

        return compactMetadata({
            campaign_code: campaignCode,
            referrer: trackingUrl(document.referrer),
            registration_url: trackingUrl(window.location.href),
            utm_source: firstNonEmpty(
                queryValue('utm_source', currentUrl, referrerUrl),
                hiddenValue(form, '[data-register-utm-source]')
            ),
            utm_medium: firstNonEmpty(
                queryValue('utm_medium', currentUrl, referrerUrl),
                hiddenValue(form, '[data-register-utm-medium]')
            ),
            utm_campaign: firstNonEmpty(
                queryValue('utm_campaign', currentUrl, referrerUrl),
                hiddenValue(form, '[data-register-utm-campaign]')
            ),
            utm_term: firstNonEmpty(
                queryValue('utm_term', currentUrl, referrerUrl),
                hiddenValue(form, '[data-register-utm-term]')
            ),
            utm_content: firstNonEmpty(
                queryValue('utm_content', currentUrl, referrerUrl),
                hiddenValue(form, '[data-register-utm-content]')
            ),
            marketing_consent: consent ? String(consent.checked) : '',
            browser_locale: locale,
            browser_timezone: browserTimezone(),
            country,
            country_source: countrySource,
            personality: firstNonEmpty(
                queryValue('personality', currentUrl, referrerUrl),
                hiddenValue(form, '[data-register-personality]')
            )
        });
    }

    function setup(kind) {
        const emailForm = document.querySelector(`[data-${kind}-email-form]`);
        if (!emailForm) return;

        const emailStep = document.querySelector(`[data-${kind}-email-step]`);
        const codeStep = document.querySelector(`[data-${kind}-code-step]`);
        const codeForm = document.querySelector(`[data-${kind}-code-form]`);
        const destinationEl = document.querySelector(`[data-${kind}-destination]`);
        const changeBtn = document.querySelector(`[data-${kind}-change]`);
        const resendBtn = document.querySelector(`[data-${kind}-resend]`);
        const statusEl = document.querySelector('[data-auth-status]');

        const api = kind === 'register' ? Auth.register : Auth.signIn;

        function showStatus(message, isError) {
            if (!statusEl) return;
            statusEl.textContent = message;
            statusEl.hidden = !message;
            statusEl.classList.toggle('alert-error', !!isError);
            statusEl.classList.toggle('alert-info', !isError);
        }

        function showCodeStep(destination) {
            if (destinationEl) destinationEl.textContent = destination;
            if (emailStep) emailStep.hidden = true;
            if (codeStep) codeStep.hidden = false;
        }

        function showEmailStep() {
            if (codeStep) codeStep.hidden = true;
            if (emailStep) emailStep.hidden = false;
        }

        function setBusy(form, busy) {
            const button = form.querySelector('button[type="submit"]');
            if (button) button.disabled = busy;
        }

        emailForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            showStatus('', false);
            const email = emailForm.querySelector(`[data-${kind}-email]`).value.trim();
            if (!email) return;

            setBusy(emailForm, true);
            try {
                const registrationContext = kind === 'register'
                    ? buildRegistrationContext(emailForm)
                    : undefined;
                const { destination } = await api.start(email, registrationContext);
                showCodeStep(destination || email);
            } catch (err) {
                showStatus(friendlyError(err), true);
            } finally {
                setBusy(emailForm, false);
            }
        });

        if (codeForm) {
            codeForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                showStatus('', false);
                const code = codeForm.querySelector(`[data-${kind}-code]`).value.trim();
                if (!code) return;

                setBusy(codeForm, true);
                try {
                    const result = await api.confirm(code);
                    if (kind === 'register' && result && result.authenticated === false) {
                        showStatus('Almost done — we just sent you one more code.', false);
                        codeForm.reset();
                        return;
                    }
                    window.location.href = '/';
                } catch (err) {
                    showStatus(friendlyError(err), true);
                } finally {
                    setBusy(codeForm, false);
                }
            });
        }

        if (changeBtn) {
            changeBtn.addEventListener('click', () => {
                showStatus('', false);
                if (codeForm) codeForm.reset();
                showEmailStep();
            });
        }

        if (resendBtn) {
            resendBtn.addEventListener('click', async () => {
                showStatus('', false);
                resendBtn.disabled = true;
                try {
                    const { destination } = await api.resend();
                    if (destinationEl && destination) destinationEl.textContent = destination;
                    showStatus('A new code has been sent.', false);
                } catch (err) {
                    showStatus(friendlyError(err), true);
                } finally {
                    resendBtn.disabled = false;
                }
            });
        }
    }

    // Wires any [data-mock-in] button to Auth.mockIn(), using whichever
    // email field is present on the page. Auth.mockIn only exists at all
    // when AUTH_CONFIG.mode === 'mock', so this is the one place that
    // feature-detects it - no mode flag is checked anywhere else.
    function setupMockIn() {
        const button = document.querySelector('[data-mock-in]');
        if (!button || typeof Auth.mockIn !== 'function') return;

        button.hidden = false;
        button.addEventListener('click', () => {
            const emailInput = document.querySelector('[data-register-email], [data-signin-email]');
            Auth.mockIn(emailInput ? emailInput.value : '');
            window.location.href = '/';
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setup('register');
        setup('signin');
        setupMockIn();
    });
})();

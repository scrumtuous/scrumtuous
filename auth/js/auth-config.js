// Cognito Configuration
// User pool: dashaway-user-pool (us-east-1_Zu0jyGn8M)
const AUTH_CONFIG = {
    region: 'us-east-1',
    clientId: '76306fkk2m6h1l76cmfktp0q2t',

    // 'cognito' (default) talks to the real user pool above. 'mock' enables
    // Auth.mockIn() and the Mock-In button for local development, bypassing
    // Cognito entirely. Never set this to 'mock' in a deployed environment.
    mode: 'cognito'
};

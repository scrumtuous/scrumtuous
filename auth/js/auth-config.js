// Cognito Configuration
// User pool: CertificationExams.pro (us-east-1_HvASertkx)
const AUTH_CONFIG = {
    region: 'us-east-1',
    userPoolId: 'us-east-1_HvASertkx',
    clientId: '76306fkk2m6h1l76cmfktp0q2t',
    usernamePrefix: '',
    givenNameFallback: 'Student',

    // 'cognito' (default) talks to the real user pool above. 'mock' enables
    // Auth.mockIn() and the Mock-In button for local development, bypassing
    // Cognito entirely. Never set this to 'mock' in a deployed environment.
    mode: 'cognito'
};

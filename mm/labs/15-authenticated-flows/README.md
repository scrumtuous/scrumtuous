# Lab 15: Authenticated Flows
Continue mission-ui from Module 14. Merge App/config changes; preserve providers/styles.
Root sources go in src/app. LoginPage sources go in src/app/login-page.
Keep existing HoldingsSummary, PlaceOrder, PortfolioBadge and optional NotFound paths.
AuthApi expects JSON credentials -> {accessToken:string} from the supplied Node /auth/login.
UI4200 auth3000 mission8090. Keep CORS configured; mission must allow Authorization.
Remove the old login chain and manual bearer headers from MissionApi.
With generated client retain its order method and same interceptor-configured HttpClient.
Fallback source is direct HttpClient: install as src/app/mission-api.ts if not using generated.
Guard returns a redirect UrlTree; login route must be unguarded.
TokenStore is memory only and checks presence, not actual JWT validity. Refresh logs out.
Verify redirect, success, invalid login, network failure, mission header and absent login header.
Query Postgres before/after one accepted test order. Do not share tokens in screenshots.
Second login exercise reveals unscoped interceptor bug. Exact origin defeats lookalike hosts.
Relative/proxy/deployed URL policy must be adapted deliberately to actual topology.
Logout clears local token; no server revocation or refresh flow is implemented.
Clear account-specific caches and coordinate pending requests when expanding the application.
Memory is not XSS-immune. API independently verifies tokens and permissions.
Offline editors are placeholder-token simulations and do not perform real auth/HTTP/crypto.

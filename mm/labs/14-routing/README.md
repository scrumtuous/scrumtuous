# Lab 14: Routing
Continue your mission-ui from Module 13. These files are additions, not a new workspace.
Merge App metadata and configuration; preserve existing providers and shared services.
Place app.routes.ts/app.ts/app.html/app.css in src/app.
Put not-found.ts under src/app/not-found/not-found.ts for the optional wildcard.
Keep HoldingsSummary and PlaceOrder standalone at the paths in app.routes.ts.
Remove their direct App imports and embedded tags. Keep PortfolioBadge outside RouterOutlet.
Keep provideRouter(routes), HTTP and other existing providers in app.config.ts.
Run npx ng build: inspect Initial and Lazy chunk files. Sizes/names vary by build.
Run npx ng serve --port 4200: root redirect, links, active state, Back/Forward.
Fresh Network log from reload at /holdings, then first Orders click, then repeat navigation.
Disable preloading during this evidence check. Loaded code is reused within this app lifetime.
Local order forms may reset when their component is destroyed; root service state can persist.
Development exercise: omit pathMatch, observe NG04014, then restore full.
The older supplied quiz describes prefix effects; the PDF shows the omitted-setting diagnostic.
For deployment, configure SPA fallback for deep links without swallowing assets/API requests.
Offline lesson editors are JavaScript simulations, not Angular Router or real lazy downloads.

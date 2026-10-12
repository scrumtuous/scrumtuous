# Labs 10–11 companion
Continue existing Angular 21 mission-ui from Lab 09. These are source additions,
not a complete workspace. Put holdings.ts, mission-api.ts and error-message.ts
under src/app, PlaceOrder in src/app/place-order/place-order.ts. Merge app.config
providers without deleting your existing configuration. Keep badge/summary.
Run mock-server.cjs outside Angular src, then ng serve --port 4200.
Mock GET /api/holdings on 3500 returns VOD.L and HSBA.L, total 2496.
GET /api/holdings/error returns a real 500. Preserve prior rows on failure.
Add loading/loadError aliases and the two load buttons shown in the lesson.
For Lab 11 start Postgres, then mission service on 8090, auth on 3000.
Both API servers must permit http://localhost:4200 and necessary method/headers.
Import PlaceOrder in App metadata and add its tag to app.html.
The supplied disposable alice/mission123 login is a classroom stand-in only.
Check OrderResponse against your actual backend DTO. The type is not validation.
Query the same holding before and after one accepted test BUY; inspect both HTTP
requests and the protected bearer header. Starting quantity is not fixed.
No automatic retry is provided for orders. Reconcile server state if uncertain.
Offline page editors are explicitly simulated and do not call these backends.

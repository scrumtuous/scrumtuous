# Lab 13: Reactive Forms
Continue your own mission-ui from Module 12. Keep its generated client and MissionApi.
Replace src/app/place-order/place-order.ts/html/css with these sources. Merge imports.
Expected wrapper contract: pending/error/lastOrder signals and submitOrder(request).
Match instrumentType and side options/types to the actual generated OrderRequestDto.
The HTTP fallback is the direct HttpClient wrapper from 10–11, NOT a generated client.
For fallback put its contents in src/app/mission-api.ts and helper in src/app/error-message.ts.
Keep provideHttpClient in app.config. App must import PlaceOrder and render its selector.
Run Postgres, mission service 8090, auth 3000, Angular 4200; configure CORS on both APIs.
Verify invalid input sends no order request. BUY a small quantity on the test account,
inspect response and compare actual Postgres holdings before/after. Then oversized SELL:
check business message and unchanged database. Current holding quantities are not fixed.
Keep server validators. UI checks can be bypassed. Curate server error messages.
Network failure is not proof a write was rolled back; reconcile before retrying orders.
PicnicGuests is a separate optional FormArray component; add it to App imports to show it.
Offline HTML editors are JavaScript models only, not Angular or real backend execution.
Module 12 lesson is not included in this bundle; the supplied PDF assumes that prerequisite.

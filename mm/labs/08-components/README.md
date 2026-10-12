# Labs 07–08 companion
Create mission-ui outside an existing Angular workspace with:
npx @angular/cli@21 new mission-ui --routing --style=css --ssr=false --skip-git
Then cd mission-ui and run npx ng serve --port 4300.
Inside that project generate holdings-summary with --standalone.
Copy the three solution files into src/app/holdings-summary/.
Import HoldingsSummary in app.ts and its metadata imports, then render
<app-holdings-summary /> in app.html. Keep any other fields used by the root.
Run ng build. This is source for an existing course app, not a full workspace.
Expected totals: 34070 initially, 35030 after BP.L, 13980 after removing ULVR.L,
960 after removing AZN.L, 0 after removing BP.L. Duplicate BP.L is guarded.
To isolate mutation caching, use unique temporary DEMO keys and remove the
hasBP disabled binding and guard during the broken experiment. Restore after.
Angular 21 defaults to zoneless; a bound template listener can refresh the view.
The teaching page uses offline JS models, not a real Angular scheduler.

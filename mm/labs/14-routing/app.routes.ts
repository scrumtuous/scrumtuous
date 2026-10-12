import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'holdings', pathMatch: 'full' },
  {
    path: 'holdings', title: 'Holdings | Mission Control',
    loadComponent: () => import('./holdings-summary/holdings-summary')
      .then(m => m.HoldingsSummary),
  },
  {
    path: 'orders', title: 'Place Order | Mission Control',
    loadComponent: () => import('./place-order/place-order')
      .then(m => m.PlaceOrder),
  },
  // Optional extension beyond the lab: fallback MUST be last.
  {
    path: '**', title: 'Not found | Mission Control',
    loadComponent: () => import('./not-found/not-found')
      .then(m => m.NotFound),
  },
];
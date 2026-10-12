import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
export const routes: Routes = [
  { path: '', redirectTo: 'holdings', pathMatch: 'full' },
  {
    path: 'holdings', canActivate: [authGuard], title: 'Holdings | Mission Control',
    loadComponent: () => import('./holdings-summary/holdings-summary')
      .then(m => m.HoldingsSummary),
  },
  {
    path: 'orders', canActivate: [authGuard], title: 'Place Order | Mission Control',
    loadComponent: () => import('./place-order/place-order')
      .then(m => m.PlaceOrder),
  },
  { path: 'login', title: 'Login | Mission Control',
    loadComponent: () => import('./login-page/login-page').then(m => m.LoginPage) },
  // Optional extension beyond the lab: fallback MUST be last.
  {
    path: '**', title: 'Not found | Mission Control',
    loadComponent: () => import('./not-found/not-found')
      .then(m => m.NotFound),
  },
];
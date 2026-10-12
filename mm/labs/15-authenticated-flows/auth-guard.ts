import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStore } from './token-store';
export const authGuard: CanActivateFn = () => {
  const store = inject(TokenStore);
  const router = inject(Router);
  return store.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
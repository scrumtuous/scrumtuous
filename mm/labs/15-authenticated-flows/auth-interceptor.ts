import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenStore } from './token-store';
import { targetsMission } from './api-urls';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenStore).getToken();
  if (token && targetsMission(req.url)) {
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  }
  return next(req);
};
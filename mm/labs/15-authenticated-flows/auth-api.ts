import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { AUTH_URL } from './api-urls';
export interface LoginResponse { accessToken: string; }
@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);
  login(username: string, password: string) {
    // Matches the supplied Node auth API's JSON contract.
    return this.http.post<unknown>(AUTH_URL, { username, password }).pipe(
      map(body => {
        if (typeof body !== 'object' || body === null
          || !('accessToken' in body) || typeof body.accessToken !== 'string'
          || !body.accessToken.trim()) {
          throw new Error('Login response did not contain an access token');
        }
        return { accessToken: body.accessToken } satisfies LoginResponse;
      }),
    );
  }
}
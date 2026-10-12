import { Injectable, computed, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class TokenStore {
  private readonly token = signal<string | null>(null);
  private readonly username = signal<string | null>(null);
  readonly isAuthenticated = computed(() => this.token() !== null);
  readonly currentUsername = this.username.asReadonly();
  setToken(token: string, username: string): void {
    if (!token.trim()) throw new Error('Empty access token');
    this.token.set(token);
    this.username.set(username);
  }
  getToken(): string | null { return this.token(); }
  clear(): void { this.token.set(null); this.username.set(null); }
}
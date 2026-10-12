import { Component, DestroyRef, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthApi } from '../auth-api';
import { TokenStore } from '../token-store';
@Component({
  selector: 'app-login-page', standalone: true, imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApi);
  private readonly store = inject(TokenStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly error = signal<string | null>(null);
  protected readonly pending = signal(false);
  protected readonly loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required], password: ['', Validators.required],
  });
  protected submit(): void {
    if (this.pending()) return;
    this.error.set(null);
    if (!this.loginForm.valid) { this.loginForm.markAllAsTouched(); return; }
    const { username, password } = this.loginForm.getRawValue();
    this.pending.set(true);
    this.authApi.login(username, password).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.pending.set(false)),
    ).subscribe({
      next: response => {
        this.store.setToken(response.accessToken, username);
        this.loginForm.controls.password.reset('');
        void this.router.navigate(['/holdings']);
      },
      error: (error: unknown) => {
        this.error.set(error instanceof HttpErrorResponse && error.status === 401
          ? 'Invalid username or password.'
          : 'Login could not be completed. Check the service and try again.');
      },
    });
  }
}
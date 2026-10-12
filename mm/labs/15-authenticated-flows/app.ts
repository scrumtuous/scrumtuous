import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PortfolioBadge } from './portfolio-badge/portfolio-badge';
import { Router } from '@angular/router';
import { TokenStore } from './token-store';
@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PortfolioBadge],
  templateUrl: './app.html', styleUrl: './app.css',
})
export class App {
  private readonly store = inject(TokenStore);
  private readonly router = inject(Router);
  protected readonly isAuthenticated = this.store.isAuthenticated;
  protected readonly currentUsername = this.store.currentUsername;
  protected logout(): void {
    this.store.clear();
    void this.router.navigate(['/login']);
  }
}
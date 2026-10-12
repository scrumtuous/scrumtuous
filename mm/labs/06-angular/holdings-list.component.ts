import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
interface Holding { ticker: string; quantity: number; }
@Component({
  selector: 'app-holdings-list',
  standalone: true,
  template: `
    <h2>Holdings</h2>
    @for (holding of holdings(); track holding.ticker) {
      <p>{{ holding.ticker }}: {{ holding.quantity }}</p>
    } @empty { <p>No holdings yet.</p> }
    <button (click)="goToOrders()">Orders</button>
  `,
})
export class HoldingsListComponent {
  private readonly router = inject(Router);
  readonly holdings = signal<Holding[]>([]);
  constructor() {
    effect(() => console.log('Holding rows:', this.holdings().length));
  }
  goToOrders(): void { void this.router.navigate(['/orders']); }
}
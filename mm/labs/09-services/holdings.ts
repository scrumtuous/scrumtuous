import { Injectable, computed, signal } from '@angular/core';

export interface Holding {
  ticker: string;
  quantity: number;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class Holdings {
  private readonly holdings = signal<Holding[]>([
    { ticker: 'ULVR.L', quantity: 500, price: 42.1 },
    { ticker: 'AZN.L', quantity: 120, price: 108.5 },
  ]);

  readonly all = this.holdings.asReadonly();
  readonly totalValue = computed(() =>
    this.holdings().reduce((sum, h) => sum + h.quantity * h.price, 0),
  );
  readonly hasBP = computed(() =>
    this.holdings().some(h => h.ticker === 'BP.L'),
  );

  add(holding: Holding): void {
    // This lesson has one row per ticker: preserve unique track keys.
    this.holdings.update(current =>
      current.some(h => h.ticker === holding.ticker)
        ? current
        : [...current, { ...holding }]);
  }

  remove(ticker: string): void {
    this.holdings.update(current =>
      current.filter(h => h.ticker !== ticker));
  }
}
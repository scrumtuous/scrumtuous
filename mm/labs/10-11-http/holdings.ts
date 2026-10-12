import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';
import { errorMessage } from './error-message';

export interface Holding {
  ticker: string;
  quantity: number;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class Holdings {
  private readonly http = inject(HttpClient);
  readonly loadError = signal<string | null>(null);
  readonly loading = signal(false);
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

  loadFromApi(url: string): void {
    if (this.loading()) return; // prevent overlapping loads in this exercise
    this.loading.set(true);
    this.loadError.set(null);
    this.http.get<Holding[]>(url).pipe(
      catchError((error: unknown) => {
        this.loadError.set(errorMessage(error));
        return of(null); // failure sentinel, NOT an empty successful portfolio
      }),
      finalize(() => this.loading.set(false)),
    ).subscribe(data => {
      if (data !== null) {
        this.loadError.set(null);
        this.holdings.set(data);
      }
    });
  }
}
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';
import { errorMessage } from './error-message';

export interface OrderRequest {
  ticker: string;
  instrumentType: 'EQUITY' | 'BOND';
  quantity: number;
  price: number;
  side: 'BUY' | 'SELL';
}
// Subset of the course response. Match your server DTO before expanding it.
export interface OrderResponse {
  status: string;
  fee: number;
  newHoldingQuantity: number;
}
const MISSION_URL = 'http://localhost:8090/accounts/1/orders';

@Injectable({ providedIn: 'root' })
export class MissionApi {
  private readonly http = inject(HttpClient);
  readonly lastOrder = signal<OrderResponse | null>(null);
  readonly error = signal<string | null>(null);
  readonly pending = signal(false);

  submitOrder(order: OrderRequest): void {
    if (this.pending()) return; // one in-flight write in this classroom example
    this.pending.set(true);
    this.error.set(null);
    this.lastOrder.set(null);
    this.http.post<OrderResponse>(MISSION_URL, order).pipe(
      catchError((error: unknown) => {
        this.error.set(errorMessage(error));
        return of(null);
      }),
      finalize(() => this.pending.set(false)),
    ).subscribe(response => {
      if (response !== null) this.lastOrder.set(response);
    });
  }
}
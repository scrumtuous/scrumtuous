import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MissionApi } from '../mission-api';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './place-order.html',
  styleUrl: './place-order.css',
})
export class PlaceOrder {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(MissionApi);
  protected readonly pending = this.api.pending;
  protected readonly error = this.api.error;
  protected readonly lastOrder = this.api.lastOrder;

  // Number inputs can become null when cleared, even with a default value.
  protected readonly orderForm = this.fb.group({
    ticker: this.fb.nonNullable.control('ULVR.L', Validators.required),
    instrumentType: this.fb.nonNullable.control<'EQUITY' | 'BOND'>('EQUITY', Validators.required),
    quantity: this.fb.control<number | null>(1, [Validators.required, Validators.min(0.01)]),
    price: this.fb.control<number | null>(40, [Validators.required, Validators.min(0.01)]),
    side: this.fb.nonNullable.control<'BUY' | 'SELL'>('BUY', Validators.required),
  });

  protected submit(): void {
    if (this.pending()) return;
    // valid also rejects PENDING or DISABLED forms; invalid alone does not.
    if (!this.orderForm.valid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    const value = this.orderForm.getRawValue();
    // Angular validation is runtime state, not a TypeScript narrowing operation.
    if (value.quantity === null || value.price === null) return;
    this.api.submitOrder({ ...value, quantity: value.quantity, price: value.price });
  }

  protected reset(): void {
    if (this.pending()) return;
    this.orderForm.reset({ ticker: 'ULVR.L', instrumentType: 'EQUITY', quantity: 1, price: 40, side: 'BUY' });
  }
}
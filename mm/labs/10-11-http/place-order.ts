import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MissionApi } from '../mission-api';
@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <button type="button" [disabled]="pending()" (click)="submitTestOrder()">
      {{ pending() ? 'Submitting...' : 'Submit test BUY order' }}
    </button>
    @if (error()) { <p role="alert">{{ error() }}</p> }
    @if (lastOrder(); as response) {
      <h3>Latest response</h3><pre>{{ response | json }}</pre>
    }
  `,
})
export class PlaceOrder {
  private readonly missionApi = inject(MissionApi);
  protected readonly lastOrder = this.missionApi.lastOrder;
  protected readonly error = this.missionApi.error;
  protected readonly pending = this.missionApi.pending;
  protected submitTestOrder(): void {
    this.missionApi.submitOrder({
      ticker: 'ULVR.L', instrumentType: 'EQUITY',
      quantity: 1, price: 40, side: 'BUY',
    });
  }
}
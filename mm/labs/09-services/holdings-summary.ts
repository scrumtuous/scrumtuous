import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Holdings } from '../holdings';

@Component({
  selector: 'app-holdings-summary',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './holdings-summary.html',
  styleUrl: './holdings-summary.css',
})
export class HoldingsSummary {
  private readonly holdingsService = inject(Holdings);
  protected readonly holdings = this.holdingsService.all;
  protected readonly totalValue = this.holdingsService.totalValue;
  protected readonly hasBP = this.holdingsService.hasBP;

  protected addHolding(): void {
    this.holdingsService.add({ ticker: 'BP.L', quantity: 200, price: 4.8 });
  }
  protected removeHolding(ticker: string): void {
    this.holdingsService.remove(ticker);
  }
}
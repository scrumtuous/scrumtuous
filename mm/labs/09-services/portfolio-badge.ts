import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Holdings } from '../holdings';

@Component({
  selector: 'app-portfolio-badge',
  standalone: true,
  imports: [DecimalPipe],
  template: `<span>Portfolio: {{ totalValue() | number: '1.2-2' }}</span>`,
})
export class PortfolioBadge {
  private readonly holdingsService = inject(Holdings);
  protected readonly totalValue = this.holdingsService.totalValue;
}
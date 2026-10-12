import { Component, computed, signal } from '@angular/core';
@Component({
  selector: 'app-pancake-counter',
  standalone: true,
  template: `
    <h2>Pancakes: {{ pancakes() }}</h2>
    <p>Syrup servings: {{ syrup() }}</p>
    <button (click)="reward()">Reward a slide ride</button>
    @if (pancakes() > 0) { <p>Breakfast is ready!</p> }
  `,
})
export class PancakeCounterComponent {
  readonly pancakes = signal(0);
  readonly syrup = computed(() => this.pancakes() * 2);
  reward(): void { this.pancakes.update(n => n + 1); }
}
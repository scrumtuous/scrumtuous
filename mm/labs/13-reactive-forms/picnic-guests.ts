import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-picnic-guests', standalone: true, imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="picnic">
      <div formArrayName="guests">
        @for (control of guests.controls; track control; let i = $index) {
          <label>Guest {{ i + 1 }} <input [formControlName]="i" /></label>
          @if (control.invalid && control.touched) { <p>Enter a guest name.</p> }
          <button type="button" (click)="remove(i)">Remove</button>
        }
      </div>
      <button type="button" (click)="add()">Add guest</button>
    </form>
  `,
})
export class PicnicGuests {
  private readonly fb = inject(FormBuilder);
  protected readonly guests = this.fb.array([
    this.fb.nonNullable.control('Raccoon', Validators.required),
    this.fb.nonNullable.control('Beaver', Validators.required),
  ]);
  protected readonly picnic = this.fb.group({ guests: this.guests });
  protected add(): void { this.guests.push(this.fb.nonNullable.control('', Validators.required)); }
  protected remove(index: number): void { this.guests.removeAt(index); }
}
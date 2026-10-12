import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-not-found', standalone: true, imports: [RouterLink],
  template: `<h2>Page not found</h2><p>That breakfast stop is not on this map.</p>
    <a routerLink="/holdings">Return to holdings</a>`,
})
export class NotFound {}
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PortfolioBadge } from './portfolio-badge/portfolio-badge';
@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PortfolioBadge],
  templateUrl: './app.html', styleUrl: './app.css',
})
export class App {}
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HoldingsSummary } from './holdings-summary/holdings-summary';
import { PortfolioBadge } from './portfolio-badge/portfolio-badge';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HoldingsSummary, PortfolioBadge],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
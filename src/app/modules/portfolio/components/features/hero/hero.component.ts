import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStateService } from '../../../../../services/portfolio-state.service';

@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  constructor(public state: PortfolioStateService) {}
}

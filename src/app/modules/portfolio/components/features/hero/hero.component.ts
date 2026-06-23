import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStateService } from '../../../../../services/portfolio-state.service';
import { SectionScrollService } from '../../../../../services/section-scroll.service';

@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  constructor(
    public state: PortfolioStateService,
    private sectionScroll: SectionScrollService
  ) {}

  navigateToPrimaryAction(event: MouseEvent): void {
    this.sectionScroll.scrollToLink(this.state.hero()?.primaryButton?.link || '#contact', event);
  }
}

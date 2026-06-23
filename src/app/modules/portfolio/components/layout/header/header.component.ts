import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../services/theme.service';
import { PortfolioStateService } from '../../../../../services/portfolio-state.service';
import { SectionScrollService } from '../../../../../services/section-scroll.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    public theme: ThemeService,
    public state: PortfolioStateService,
    private sectionScroll: SectionScrollService
  ) {}

  navigateToSection(event: MouseEvent, link: string): void {
    this.sectionScroll.scrollToLink(link, event);
  }

  getSocialUrl(platform: string): string {
    const link = this.state.socialLinks().find(l => l.platform.toLowerCase() === platform.toLowerCase());
    return link ? link.url : '';
  }
}

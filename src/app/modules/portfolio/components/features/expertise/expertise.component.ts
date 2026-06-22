import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationService } from '../../../../../services/scroll-animation.service';
import { PortfolioStateService } from '../../../../../services/portfolio-state.service';

@Component({
  standalone: true,
  selector: 'app-expertise',
  imports: [CommonModule],
  templateUrl: './expertise.component.html',
  styleUrl: './expertise.component.css'
})
export class ExpertiseComponent implements AfterViewInit {
  @ViewChildren('animateOnScroll') animItems!: QueryList<ElementRef>;

  constructor(
    private scrollAnim: ScrollAnimationService,
    public state: PortfolioStateService
  ) {}

  ngAfterViewInit() {
    this.animItems.changes.subscribe(() => {
      this.scrollAnim.observe(this.animItems.map(el => el.nativeElement));
    });
    if (this.animItems.length > 0) {
      this.scrollAnim.observe(this.animItems.map(el => el.nativeElement));
    }
  }

  getIconKey(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('frontend')) return 'globe';
    if (t.includes('backend') || t.includes('api')) return 'server';
    if (t.includes('database') || t.includes('optimization') || t.includes('sql')) return 'database';
    if (t.includes('integration')) return 'cpu';
    if (t.includes('cloud') || t.includes('devops')) return 'cloud';
    if (t.includes('architecture')) return 'terminal';
    return 'terminal';
  }
}

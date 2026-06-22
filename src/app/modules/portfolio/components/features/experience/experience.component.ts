import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationService } from '../../../../../services/scroll-animation.service';
import { PortfolioStateService } from '../../../../../services/portfolio-state.service';

@Component({
  standalone: true,
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements AfterViewInit {
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

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return 'Present';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }
}

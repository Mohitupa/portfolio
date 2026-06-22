import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationService } from '../../../../../services/scroll-animation.service';
import { PortfolioStateService } from '../../../../../services/portfolio-state.service';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements AfterViewInit {
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

  getLinkedInUrl(): string | null {
    const link = this.state.socialLinks().find(s => s.platform.toLowerCase() === 'linkedin');
    return link ? link.url : null;
  }
}

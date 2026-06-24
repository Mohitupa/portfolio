import { AfterViewInit, Component, ElementRef, NgZone, QueryList, ViewChildren, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationService } from '../../../../../services/scroll-animation.service';
import { PortfolioStateService } from '../../../../../services/portfolio-state.service';
import { ProjectItem } from '../../../../../models/portfolio.model';

interface RichProject extends ProjectItem {
  image: string;
  accentClass: string;
  badgeClass: string;
  borderClass: string;
  tagBorderClass: string;
}

@Component({
  standalone: true,
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChildren('animateOnScroll') animItems!: QueryList<ElementRef>;

  current = 0;
  next = 0;
  isFlipping = false;
  flipDirection: 'next' | 'prev' = 'next';
  flipStage: 'idle' | 'flipping' | 'done' = 'idle';

  constructor(
    private zone: NgZone,
    private scrollAnim: ScrollAnimationService,
    public state: PortfolioStateService
  ) {
    // Reset carousel index pointers when list of projects changes (e.g. on slug change)
    effect(() => {
      this.state.projects();
      this.current = 0;
      this.next = 0;
    });
  }

  get projectsList(): RichProject[] {
    const ACCENT_SCHEMES = [
      { accentClass: 'accent-teal', badgeClass: 'badge-teal', borderClass: 'border-teal', tagBorderClass: 'tag-teal' },
      { accentClass: 'accent-blue', badgeClass: 'badge-blue', borderClass: 'border-blue', tagBorderClass: 'tag-blue' },
      { accentClass: 'accent-violet', badgeClass: 'badge-violet', borderClass: 'border-violet', tagBorderClass: 'tag-violet' },
      { accentClass: 'accent-orange', badgeClass: 'badge-orange', borderClass: 'border-orange', tagBorderClass: 'tag-orange' },
      { accentClass: 'accent-rose', badgeClass: 'badge-rose', borderClass: 'border-rose', tagBorderClass: 'tag-rose' }
    ];

    return this.state.projects().map((item, idx) => {
      const scheme = ACCENT_SCHEMES[idx % ACCENT_SCHEMES.length];
      return {
        ...item,
        image: this.getProjectImage(item),
        ...scheme
      };
    });
  }

  get currentProject(): RichProject | null {
    return this.projectsList[this.current] || null;
  }

  get nextProject(): RichProject | null {
    return this.projectsList[this.next] || null;
  }

  ngAfterViewInit() {
    this.animItems.changes.subscribe(() => {
      this.scrollAnim.observe(this.animItems.map(el => el.nativeElement));
    });
    if (this.animItems.length > 0) {
      this.scrollAnim.observe(this.animItems.map(el => el.nativeElement));
    }
  }

  getProjectImage(item: ProjectItem): string {
    const filePath =
      item.coverImage?.mediaId?.filePath ||
      item.coverImage?.filePath ||
      item.coverImage?.url;

    if (filePath) return filePath;

    // Fallbacks only if API doesn't return an image
    const slug = item.slug.toLowerCase();
    if (slug.includes('rider') || slug.includes('smart')) return '/smart-rider.png';
    if (slug.includes('roatan') || slug.includes('roatam') || slug.includes('travel')) return '/anything-roatam.png';
    if (slug.includes('nimbus') || slug.includes('storage')) return '/nimbusdata.png';
    if (slug.includes('fba') || slug.includes('amazon')) return '/fba-system.png';
    if (slug.includes('idair') || slug.includes('health') || slug.includes('digital')) return '/digital-health.png';
    return '/smart-rider.png';
  }

  navigate(dir: 'next' | 'prev') {
    if (this.isFlipping) return;
    const nextIdx = dir === 'next' ? this.current + 1 : this.current - 1;
    if (nextIdx < 0 || nextIdx >= this.projectsList.length) return;

    this.next = nextIdx;
    this.flipDirection = dir;
    this.isFlipping = true;
    this.flipStage = 'flipping';

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.current = nextIdx;
          this.flipStage = 'done';
        });

        setTimeout(() => {
          this.zone.run(() => {
            this.flipStage = 'idle';
            this.isFlipping = false;
          });
        }, 50);
      }, 450);
    });
  }

  goTo(index: number) {
    if (this.isFlipping || index === this.current) return;
    this.flipDirection = index > this.current ? 'next' : 'prev';
    this.next = index;
    this.isFlipping = true;
    this.flipStage = 'flipping';

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.current = index;
          this.flipStage = 'done';
        });
        setTimeout(() => {
          this.zone.run(() => {
            this.flipStage = 'idle';
            this.isFlipping = false;
          });
        }, 50);
      }, 450);
    });
  }
}
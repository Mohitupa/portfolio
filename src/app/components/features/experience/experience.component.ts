import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ScrollAnimationService } from '../../../services/scroll-animation.service';

@Component({
  standalone: true,
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements AfterViewInit {

  // In component class:
  @ViewChildren('animateOnScroll') animItems!: QueryList<ElementRef>;

  constructor(private scrollAnim: ScrollAnimationService) { }

  ngAfterViewInit() {
    this.scrollAnim.observe(this.animItems.map(el => el.nativeElement));
  }
}

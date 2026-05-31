import { Component } from '@angular/core';
import { AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ScrollAnimationService } from '../../../services/scroll-animation.service';

@Component({
  standalone: true,
  selector: 'app-expertise',
  imports: [],
  templateUrl: './expertise.component.html',
  styleUrl: './expertise.component.css'
})
export class ExpertiseComponent implements AfterViewInit {

  // In component class:
  @ViewChildren('animateOnScroll') animItems!: QueryList<ElementRef>;

  constructor(private scrollAnim: ScrollAnimationService) { }

  ngAfterViewInit() {
    this.scrollAnim.observe(this.animItems.map(el => el.nativeElement));
  }
}

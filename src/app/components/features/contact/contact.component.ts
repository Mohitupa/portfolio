import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ScrollAnimationService } from '../../../services/scroll-animation.service';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements AfterViewInit {

  // In component class:
  @ViewChildren('animateOnScroll') animItems!: QueryList<ElementRef>;

  constructor(private scrollAnim: ScrollAnimationService) { }

  ngAfterViewInit() {
    this.scrollAnim.observe(this.animItems.map(el => el.nativeElement));
  }
}

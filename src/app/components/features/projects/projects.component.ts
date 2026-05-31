import { AfterViewInit, Component, ElementRef, NgZone, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationService } from '../../../services/scroll-animation.service';

interface Project {
  id: string;
  year: string;
  title: string;
  description: string;
  bullets: string[];
  tags: string[];
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

  // In component class:
  @ViewChildren('animateOnScroll') animItems!: QueryList<ElementRef>;


  current = 0;
  next = 0;
  isFlipping = false;
  flipDirection: 'next' | 'prev' = 'next';
  flipStage: 'idle' | 'flipping' | 'done' = 'idle';

  projects: Project[] = [
    {
      id: 'smart-rider', year: '2025–26', title: 'Smart Rider',
      description: 'An AI-powered in-transit engagement platform combining real-time transport data, multilingual voice interactions (OpenAI GPT-3.5 + Whisper), and live analytics dashboards.',
      bullets: ['Integrated OpenAI GPT-3.5, Cohere AI & Whisper for multilingual voice interactions', 'Secure RBAC with JWT; admin dashboard with amCharts 5 & ECharts', 'Orchestrated Uber API & OpenAI API for real-time data sync'],
      tags: ['Angular 19', 'Node.js', 'MongoDB', 'JWT', 'amCharts 5', 'ECharts'],
      image: '/smart-rider.png',
      accentClass: 'accent-teal', badgeClass: 'badge-teal', borderClass: 'border-teal', tagBorderClass: 'tag-teal'
    },
    {
      id: 'anything-roatan', year: '2025', title: 'Anything Roatan',
      description: 'A full-featured travel platform covering restaurants, activities, events, taxi bookings with live Google Maps fare calculation, insurance, and relocation.',
      bullets: ['PixelPay gateway for activities, events & taxi — with failure & retry flows', 'Real-time taxi booking with Google Maps fare calculation', 'In-app chat with message persistence & real-time updates'],
      tags: ['Angular', 'Ionic', 'CodeIgniter', 'Google Maps', 'PixelPay'],
      image: '/anything-roatam.png',
      accentClass: 'accent-blue', badgeClass: 'badge-blue', borderClass: 'border-blue', tagBorderClass: 'tag-blue'
    },
    {
      id: 'nimbus-data', year: '2024', title: 'Nimbus Data',
      description: 'Enterprise storage management platform with 100+ screens — real-time dashboards, CRUD operations with live clones/snapshots, and modular Angular architecture.',
      bullets: ['Modular Angular architecture with lazy loading, guards & interceptors', 'Real-time dashboards: controllers, drives, frames, pools, sensors', 'Complex CRUD: snapshots, clones, replication, wipe, reboot, shutdown'],
      tags: ['Angular 19', 'Angular Material', 'RxJS', 'Laravel/Lumen', 'MySQL'],
      image: '/nimbusdata.png',
      accentClass: 'accent-violet', badgeClass: 'badge-violet', borderClass: 'border-violet', tagBorderClass: 'tag-violet'
    },
    {
      id: 'fba-system', year: '2023', title: 'FBA System',
      description: 'Automated Amazon FBA inventory management system with subscription billing (Stripe), Google Sheets sync, and Amazon SP-API integration — reduced manual oversight by 40%.',
      bullets: ['Stripe subscription model — reduced manual inventory oversight by 40%', 'Promocode engine for customer engagement campaigns', 'Deployed on AWS EC2, S3, and RDS'],
      tags: ['Angular', 'Node.js', 'PostgreSQL', 'Stripe', 'Amazon SP-API', 'AWS'],
      image: '/fba-system.png',
      accentClass: 'accent-orange', badgeClass: 'badge-orange', borderClass: 'border-orange', tagBorderClass: 'tag-orange'
    },
    {
      id: 'idair', year: '2023', title: 'Digital Health i-DAIR',
      description: 'A global health analytics platform visualising National Digital Health Strategies — interactive maps, bubble charts, bar/radar charts, and multi-year dataset comparisons.',
      bullets: ['Interactive dashboards: maps, bar, bubble, radar & pie charts', 'NestJS REST APIs for multi-year health & IT dataset comparison'],
      tags: ['Angular', 'RxJS', 'amCharts', 'NestJS', 'PostgreSQL'],
      image: '/digital-health.png',
      accentClass: 'accent-rose', badgeClass: 'badge-rose', borderClass: 'border-rose', tagBorderClass: 'tag-rose'
    }
  ];

  constructor(private zone: NgZone, private scrollAnim: ScrollAnimationService) { }

  get currentProject(): Project { return this.projects[this.current]; }
  get nextProject(): Project { return this.projects[this.next]; }


  ngAfterViewInit() {
    this.scrollAnim.observe(this.animItems.map(el => el.nativeElement));
  }

  navigate(dir: 'next' | 'prev') {
    if (this.isFlipping) return;
    const nextIdx = dir === 'next' ? this.current + 1 : this.current - 1;
    if (nextIdx < 0 || nextIdx >= this.projects.length) return;

    this.next = nextIdx;
    this.flipDirection = dir;
    this.isFlipping = true;
    this.flipStage = 'flipping';

    // Run the mid-flip swap OUTSIDE Angular zone — no change detection = no freeze
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        // Re-enter zone only to update current at the exact 90° midpoint
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
      }, 450); // exactly half of the 600ms animation — hits at 90° peak
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
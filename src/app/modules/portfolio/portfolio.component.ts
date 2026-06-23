import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { PortfolioStateService } from '../../services/portfolio-state.service';
import { ThemeService } from '../../services/theme.service';
import { SectionScrollService } from '../../services/section-scroll.service';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeroComponent } from './components/features/hero/hero.component';
import { ExpertiseComponent } from './components/features/expertise/expertise.component';
import { SkillsComponent } from './components/features/skills/skills.component';
import { ExperienceComponent } from './components/features/experience/experience.component';
import { ProjectsComponent } from './components/features/projects/projects.component';
import { EducationComponent } from './components/features/education/education.component';
import { ContactComponent } from './components/features/contact/contact.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    ExpertiseComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    EducationComponent,
    ContactComponent
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private routeSub?: Subscription;
  private initialHashScrolled = '';

  constructor(
    private route: ActivatedRoute,
    public state: PortfolioStateService,
    public theme: ThemeService,
    private sectionScroll: SectionScrollService
  ) {
    effect(() => {
      if (!this.state.portfolioData()) {
        return;
      }

      const hash = window.location.hash;
      if (!hash || hash === this.initialHashScrolled) {
        return;
      }

      this.initialHashScrolled = hash;
      window.setTimeout(() => this.sectionScroll.scrollToLink(hash), 0);
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.state.loadPortfolio(slug);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}

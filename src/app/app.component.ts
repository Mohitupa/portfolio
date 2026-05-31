import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeroComponent } from './components/features/hero/hero.component';
import { ExpertiseComponent } from './components/features/expertise/expertise.component';
import { SkillsComponent } from './components/features/skills/skills.component';
import { ExperienceComponent } from './components/features/experience/experience.component';
import { ProjectsComponent } from './components/features/projects/projects.component';
import { EducationComponent } from './components/features/education/education.component';
import { ContactComponent } from './components/features/contact/contact.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
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
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'portfolio';

  constructor(public theme: ThemeService) { }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void { }
}

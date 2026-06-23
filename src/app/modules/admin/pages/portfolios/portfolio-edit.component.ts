import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import {
  HeroStat,
  PortfolioContent,
  PortfolioContentPayload,
  ProjectContent,
  SkillContent,
  SkillTagContent,
} from '../../../../models/admin.model';
import { AdminApiService } from '../../../../services/admin-api.service';

type EditorTab = 'hero' | 'skills' | 'projects' | 'seo' | 'theme';

@Component({
  selector: 'app-admin-portfolio-edit',
  standalone: true,
  imports: [DatePipe, NgClass, NgFor, NgIf, ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      <a routerLink="/admin/portfolios" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        <span>Back to portfolios</span>
      </a>

      <div class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-sm sticky top-4 z-20">
        <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-widest font-bold text-primary mb-2">Portfolio Content CMS</p>
            <h1 class="font-serif text-3xl font-extrabold text-foreground tracking-tight">
              {{ content()?.hero?.name || 'Content Editor' }}
            </h1>
            <p class="text-sm text-muted-foreground mt-1 font-medium">
              Editing <span class="font-bold text-foreground">/{{ slug() || portfolioId() }}</span>
              <span *ngIf="content()?.updatedAt"> · Updated {{ content()?.updatedAt | date:'medium' }}</span>
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border"
              [ngClass]="isPublished() ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/60 text-muted-foreground border-border'"
            >
              <span class="h-2 w-2 rounded-full" [ngClass]="isPublished() ? 'bg-primary shadow-sm shadow-primary/40' : 'bg-muted-foreground/40'"></span>
              {{ isPublished() ? 'Published' : 'Draft' }}
            </span>

            <button
              type="button"
              (click)="saveContent()"
              [disabled]="saving() || loading()"
              class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border text-sm font-bold text-foreground hover:bg-secondary/40 disabled:opacity-50"
            >
              {{ saving() ? 'Saving...' : content() ? 'Save Draft' : 'Create Draft' }}
            </button>

            <button
              type="button"
              (click)="togglePublish()"
              [disabled]="publishing() || saving() || !content()"
              class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm disabled:opacity-50"
            >
              {{ publishing() ? 'Updating...' : isPublished() ? 'Unpublish' : 'Publish' }}
            </button>
          </div>
        </div>

        <div class="mt-5 flex gap-2 overflow-x-auto pb-1">
          <button
            *ngFor="let tab of tabs"
            type="button"
            (click)="activeTab.set(tab.key)"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap transition-colors"
            [ngClass]="activeTab() === tab.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-background/50 text-muted-foreground border-border hover:text-foreground hover:bg-secondary/40'"
          >
            <span class="h-2 w-2 rounded-full" [ngClass]="activeTab() === tab.key ? 'bg-primary-foreground' : 'bg-primary/50'"></span>
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div *ngIf="notice()" class="rounded-2xl border border-primary/20 bg-primary/10 text-primary px-4 py-3 text-sm font-semibold">
        {{ notice() }}
      </div>

      <div *ngIf="error()" class="rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive px-4 py-3 text-sm font-semibold">
        {{ error() }}
      </div>

      <div *ngIf="loading()" class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div *ngFor="let item of [1, 2, 3, 4]" class="h-44 rounded-3xl bg-muted/40 animate-pulse"></div>
      </div>

      <form *ngIf="!loading()" [formGroup]="contentForm" (ngSubmit)="saveContent()" class="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6">
        <section class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-sm">
          <ng-container *ngIf="activeTab() === 'hero'">
            <div class="border-b border-border/80 pb-5 mb-5">
              <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Hero</p>
              <h2 class="font-serif text-xl font-extrabold text-foreground mt-1">First viewport content</h2>
            </div>

            <div formGroupName="hero" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="space-y-2">
                <span class="admin-label">Greeting</span>
                <input formControlName="greeting" class="admin-input" placeholder="Hi, I'm" />
              </label>
              <label class="space-y-2">
                <span class="admin-label">Name</span>
                <input formControlName="name" class="admin-input" placeholder="Mohit Upadhyay" />
              </label>
              <label class="space-y-2 md:col-span-2">
                <span class="admin-label">Title</span>
                <input formControlName="title" class="admin-input" placeholder="Software Developer" />
              </label>
              <label class="space-y-2 md:col-span-2">
                <span class="admin-label">Short Description</span>
                <textarea formControlName="shortDescription" rows="4" class="admin-input resize-y" placeholder="Short intro for the hero section"></textarea>
              </label>
              <label class="space-y-2">
                <span class="admin-label">Email</span>
                <input formControlName="email" type="email" class="admin-input" placeholder="hello@example.com" />
              </label>
              <label class="space-y-2">
                <span class="admin-label">Phone</span>
                <input formControlName="phone" class="admin-input" placeholder="+91 ..." />
              </label>
              <label class="space-y-2 md:col-span-2">
                <span class="admin-label">Location</span>
                <input formControlName="location" class="admin-input" placeholder="India" />
              </label>

              <div formGroupName="profileImage" class="md:col-span-2 grid grid-cols-1 md:grid-cols-[1fr_16rem] gap-4 rounded-3xl border border-border/80 bg-background/40 p-4">
                <label class="space-y-2">
                  <span class="admin-label">Profile Image URL</span>
                  <input formControlName="url" class="admin-input" placeholder="https://..." />
                </label>
                <label class="space-y-2">
                  <span class="admin-label">Alt Text</span>
                  <input formControlName="alt" class="admin-input" placeholder="Profile portrait" />
                </label>
              </div>

              <div formGroupName="primaryButton" class="rounded-3xl border border-border/80 bg-background/40 p-4 space-y-3">
                <p class="admin-label">Primary Button</p>
                <input formControlName="text" class="admin-input" placeholder="Get in touch" />
                <input formControlName="link" class="admin-input" placeholder="#contact" />
              </div>

              <div formGroupName="secondaryButton" class="rounded-3xl border border-border/80 bg-background/40 p-4 space-y-3">
                <p class="admin-label">Secondary Button</p>
                <input formControlName="text" class="admin-input" placeholder="Download CV" />
                <input formControlName="link" class="admin-input" placeholder="/Resume.pdf" />
              </div>

              <label class="md:col-span-2 inline-flex items-center gap-3 rounded-2xl border border-border/80 bg-background/40 p-4">
                <input formControlName="isOpenToWork" type="checkbox" class="h-4 w-4 accent-primary" />
                <span class="text-sm font-bold text-foreground">Show open-to-work badge</span>
              </label>

              <div formGroupName="openToWorkBadge" class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl border border-border/80 bg-background/40 p-4">
                <label class="space-y-2">
                  <span class="admin-label">Badge Text</span>
                  <input formControlName="text" class="admin-input" placeholder="OPEN TO WORK" />
                </label>
                <label class="space-y-2">
                  <span class="admin-label">Badge Icon</span>
                  <input formControlName="icon" class="admin-input" placeholder="sparkles" />
                </label>
              </div>

              <label class="space-y-2 md:col-span-2">
                <span class="admin-label">Stats</span>
                <textarea formControlName="statsText" rows="5" class="admin-input font-mono text-xs resize-y" placeholder="5+ | Projects | briefcase | 1"></textarea>
              </label>
            </div>
          </ng-container>

          <ng-container *ngIf="activeTab() === 'skills'">
            <div class="border-b border-border/80 pb-5 mb-5">
              <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Skills Section</p>
              <h2 class="font-serif text-xl font-extrabold text-foreground mt-1">Skills and tags</h2>
            </div>

            <div formGroupName="skillsSection" class="space-y-4">
              <label class="space-y-2 block">
                <span class="admin-label">Subtitle</span>
                <input formControlName="subtitle" class="admin-input" placeholder="TECH STACK" />
              </label>
              <label class="space-y-2 block">
                <span class="admin-label">Title</span>
                <input formControlName="title" class="admin-input" placeholder="Tools I work with" />
              </label>
              <label class="space-y-2 block">
                <span class="admin-label">Skills</span>
                <textarea formControlName="skillsText" rows="10" class="admin-input font-mono text-xs resize-y" placeholder="Angular | angular | Frontend | 1 | true"></textarea>
              </label>
              <label class="space-y-2 block">
                <span class="admin-label">Skill Tags</span>
                <textarea formControlName="skillTagsText" rows="6" class="admin-input font-mono text-xs resize-y" placeholder="RxJS | 1 | true"></textarea>
              </label>
            </div>
          </ng-container>

          <ng-container *ngIf="activeTab() === 'projects'">
            <div class="border-b border-border/80 pb-5 mb-5">
              <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Projects Section</p>
              <h2 class="font-serif text-xl font-extrabold text-foreground mt-1">Case studies and project cards</h2>
            </div>

            <div formGroupName="projectsSection" class="space-y-4">
              <label class="space-y-2 block">
                <span class="admin-label">Subtitle</span>
                <input formControlName="subtitle" class="admin-input" placeholder="PROJECTS" />
              </label>
              <label class="space-y-2 block">
                <span class="admin-label">Title</span>
                <input formControlName="title" class="admin-input" placeholder="Selected work" />
              </label>
              <label class="space-y-2 block">
                <span class="admin-label">Description</span>
                <textarea formControlName="description" rows="3" class="admin-input resize-y"></textarea>
              </label>
              <label class="space-y-2 block">
                <span class="admin-label">Projects JSON</span>
                <textarea formControlName="projectsJson" rows="18" class="admin-input font-mono text-xs resize-y"></textarea>
              </label>
            </div>
          </ng-container>

          <ng-container *ngIf="activeTab() === 'seo'">
            <div class="border-b border-border/80 pb-5 mb-5">
              <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">SEO</p>
              <h2 class="font-serif text-xl font-extrabold text-foreground mt-1">Search and sharing metadata</h2>
            </div>

            <div formGroupName="seo" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="space-y-2 md:col-span-2">
                <span class="admin-label">Meta Title</span>
                <input formControlName="metaTitle" class="admin-input" />
              </label>
              <label class="space-y-2 md:col-span-2">
                <span class="admin-label">Meta Description</span>
                <textarea formControlName="metaDescription" rows="4" class="admin-input resize-y"></textarea>
              </label>
              <label class="space-y-2 md:col-span-2">
                <span class="admin-label">Keywords</span>
                <input formControlName="metaKeywordsText" class="admin-input" placeholder="Angular, Node.js, Portfolio" />
              </label>
              <div formGroupName="ogImage" class="md:col-span-2 grid grid-cols-1 md:grid-cols-[1fr_16rem] gap-4 rounded-3xl border border-border/80 bg-background/40 p-4">
                <label class="space-y-2">
                  <span class="admin-label">OG Image URL</span>
                  <input formControlName="url" class="admin-input" />
                </label>
                <label class="space-y-2">
                  <span class="admin-label">Alt Text</span>
                  <input formControlName="alt" class="admin-input" />
                </label>
              </div>
            </div>
          </ng-container>

          <ng-container *ngIf="activeTab() === 'theme'">
            <div class="border-b border-border/80 pb-5 mb-5">
              <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Theme</p>
              <h2 class="font-serif text-xl font-extrabold text-foreground mt-1">Visual identity and files</h2>
            </div>

            <div formGroupName="theme" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label class="space-y-2">
                <span class="admin-label">Primary Color</span>
                <input formControlName="primaryColor" type="color" class="h-12 w-full rounded-2xl border border-border bg-background/70 px-2" />
              </label>
              <label class="space-y-2">
                <span class="admin-label">Secondary Color</span>
                <input formControlName="secondaryColor" type="color" class="h-12 w-full rounded-2xl border border-border bg-background/70 px-2" />
              </label>
              <label class="space-y-2">
                <span class="admin-label">Background Color</span>
                <input formControlName="backgroundColor" type="color" class="h-12 w-full rounded-2xl border border-border bg-background/70 px-2" />
              </label>
              <div formGroupName="logo" class="md:col-span-3 grid grid-cols-1 md:grid-cols-[1fr_16rem] gap-4 rounded-3xl border border-border/80 bg-background/40 p-4">
                <label class="space-y-2">
                  <span class="admin-label">Logo URL</span>
                  <input formControlName="url" class="admin-input" />
                </label>
                <label class="space-y-2">
                  <span class="admin-label">Alt Text</span>
                  <input formControlName="alt" class="admin-input" />
                </label>
              </div>
              <label class="space-y-2 md:col-span-3">
                <span class="admin-label">Resume File</span>
                <input formControlName="resumeFile" class="admin-input" placeholder="/Resume.pdf" />
              </label>
            </div>
          </ng-container>
        </section>

        <aside class="space-y-4">
          <div class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-sm">
            <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Editor Notes</p>
            <div class="mt-4 space-y-3 text-xs text-muted-foreground leading-relaxed">
              <p><span class="font-bold text-foreground">Stats:</span> one per line as value | label | icon | order.</p>
              <p><span class="font-bold text-foreground">Skills:</span> name | icon | category | order | visible.</p>
              <p><span class="font-bold text-foreground">Tags:</span> name | order | visible.</p>
              <p><span class="font-bold text-foreground">Projects:</span> valid JSON array using the backend project fields.</p>
            </div>
          </div>

          <div class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-sm">
            <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Content Health</p>
            <div class="mt-4 space-y-3">
              <div class="flex items-center justify-between gap-3 text-sm">
                <span class="font-semibold text-muted-foreground">Hero stats</span>
                <span class="font-bold text-foreground">{{ getHeroStatsCount() }}</span>
              </div>
              <div class="flex items-center justify-between gap-3 text-sm">
                <span class="font-semibold text-muted-foreground">Skills</span>
                <span class="font-bold text-foreground">{{ getSkillsCount() }}</span>
              </div>
              <div class="flex items-center justify-between gap-3 text-sm">
                <span class="font-semibold text-muted-foreground">Projects</span>
                <span class="font-bold text-foreground">{{ getProjectsCount() }}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            [disabled]="saving() || loading()"
            class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm disabled:opacity-50"
          >
            {{ saving() ? 'Saving...' : 'Save Content' }}
          </button>
        </aside>
      </form>
    </div>
  `,
  styles: [`
    .admin-label {
      display: block;
      color: hsl(var(--muted-foreground));
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .admin-input {
      width: 100%;
      border-radius: 1rem;
      border: 1px solid hsl(var(--border));
      background: hsl(var(--background) / 0.7);
      color: hsl(var(--foreground));
      font-size: 0.875rem;
      font-weight: 600;
      outline: none;
      padding: 0.75rem 1rem;
    }

    .admin-input:focus {
      border-color: hsl(var(--primary) / 0.5);
      box-shadow: 0 0 0 4px hsl(var(--primary) / 0.1);
    }
  `],
})
export class PortfolioEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private adminApi = inject(AdminApiService);

  tabs: { key: EditorTab; label: string }[] = [
    { key: 'hero', label: 'Hero' },
    { key: 'skills', label: 'Skills Section' },
    { key: 'projects', label: 'Projects Section' },
    { key: 'seo', label: 'SEO' },
    { key: 'theme', label: 'Theme' },
  ];

  activeTab = signal<EditorTab>('hero');
  content = signal<PortfolioContent | null>(null);
  loading = signal(true);
  saving = signal(false);
  publishing = signal(false);
  error = signal('');
  notice = signal('');

  portfolioId = computed(() => this.route.snapshot.paramMap.get('id') || '');
  slug = computed(() => this.route.snapshot.queryParamMap.get('slug') || this.portfolioId());
  isPublished = computed(() => !!this.content()?.isPublished);

  contentForm = this.fb.nonNullable.group({
    hero: this.fb.nonNullable.group({
      greeting: ['Hi, I am'],
      name: ['', [Validators.required, Validators.minLength(2)]],
      title: [''],
      shortDescription: [''],
      profileImage: this.fb.nonNullable.group({
        url: [''],
        alt: [''],
      }),
      email: ['admin@example.com', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      primaryButton: this.fb.nonNullable.group({
        text: ['Get in touch'],
        link: ['#contact'],
      }),
      secondaryButton: this.fb.nonNullable.group({
        text: ['Download CV'],
        link: ['/Resume.pdf'],
      }),
      isOpenToWork: [true],
      openToWorkBadge: this.fb.nonNullable.group({
        text: ['OPEN TO WORK'],
        icon: ['sparkles'],
      }),
      statsText: [''],
    }),
    skillsSection: this.fb.nonNullable.group({
      subtitle: ['TECH STACK'],
      title: ['Skills'],
      skillsText: [''],
      skillTagsText: [''],
    }),
    projectsSection: this.fb.nonNullable.group({
      subtitle: ['PROJECTS'],
      title: ['Selected Work'],
      description: [''],
      projectsJson: ['[]'],
    }),
    seo: this.fb.nonNullable.group({
      metaTitle: [''],
      metaDescription: [''],
      metaKeywordsText: [''],
      ogImage: this.fb.nonNullable.group({
        url: [''],
        alt: [''],
      }),
    }),
    theme: this.fb.nonNullable.group({
      primaryColor: ['#2f947f'],
      secondaryColor: ['#f3f4f6'],
      backgroundColor: ['#f4f1ea'],
      logo: this.fb.nonNullable.group({
        url: [''],
        alt: [''],
      }),
      resumeFile: ['/Resume.pdf'],
    }),
  });

  ngOnInit(): void {
    this.loadContent();
  }

  getHeroStatsCount(): number {
    return this.parseStats(this.contentForm.controls.hero.controls.statsText.value).length;
  }

  getSkillsCount(): number {
    return this.parseSkills(this.contentForm.controls.skillsSection.controls.skillsText.value).length;
  }

  getProjectsCount(): number {
    return this.parseProjectsSafe().length;
  }

  loadContent(): void {
    this.loading.set(true);
    this.error.set('');
    this.notice.set('');

    this.adminApi.getPortfolioContent(this.slug())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => {
          this.content.set(response.data);
          this.patchForm(response.data);
        },
        error: () => {
          this.content.set(null);
          this.notice.set('No editable content was returned. You can create the first draft from this editor.');
        },
      });
  }

  saveContent(): void {
    if (this.contentForm.invalid) {
      this.contentForm.markAllAsTouched();
      this.error.set('Please fix the highlighted fields before saving.');
      return;
    }

    let payload: PortfolioContentPayload;
    try {
      payload = this.buildPayload();
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Could not prepare content payload.');
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.notice.set('');

    const request = this.content()
      ? this.adminApi.updatePortfolioContent(this.portfolioId(), payload)
      : this.adminApi.createPortfolioContent(this.portfolioId(), payload);

    request
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: response => {
          this.content.set(response.data);
          this.patchForm(response.data);
          this.notice.set(this.content()?._id ? 'Content saved successfully.' : 'Draft content created successfully.');
        },
        error: error => this.error.set(error?.error?.message || 'Could not save content. Please confirm the portfolio-content admin endpoint is available.'),
      });
  }

  togglePublish(): void {
    if (!this.content()) {
      return;
    }

    this.publishing.set(true);
    this.error.set('');
    this.notice.set('');

    const request = this.isPublished()
      ? this.adminApi.unpublishPortfolioContent(this.portfolioId())
      : this.adminApi.publishPortfolioContent(this.portfolioId());

    request
      .pipe(finalize(() => this.publishing.set(false)))
      .subscribe({
        next: response => {
          this.content.set(response.data);
          this.notice.set(this.isPublished() ? 'Portfolio content published.' : 'Portfolio content unpublished.');
        },
        error: error => this.error.set(error?.error?.message || 'Could not update publish status.'),
      });
  }

  private patchForm(data: PortfolioContent): void {
    this.contentForm.patchValue({
      hero: {
        greeting: data.hero?.greeting || 'Hi, I am',
        name: data.hero?.name || '',
        title: data.hero?.title || '',
        shortDescription: data.hero?.shortDescription || '',
        profileImage: {
          url: data.hero?.profileImage?.url || '',
          alt: data.hero?.profileImage?.alt || '',
        },
        email: data.hero?.email || 'admin@example.com',
        phone: data.hero?.phone || '',
        location: data.hero?.location || '',
        primaryButton: {
          text: data.hero?.primaryButton?.text || 'Get in touch',
          link: data.hero?.primaryButton?.link || '#contact',
        },
        secondaryButton: {
          text: data.hero?.secondaryButton?.text || 'Download CV',
          link: data.hero?.secondaryButton?.link || '/Resume.pdf',
        },
        isOpenToWork: data.hero?.isOpenToWork ?? true,
        openToWorkBadge: {
          text: data.hero?.openToWorkBadge?.text || 'OPEN TO WORK',
          icon: data.hero?.openToWorkBadge?.icon || 'sparkles',
        },
        statsText: this.formatStats(data.hero?.stats || []),
      },
      skillsSection: {
        subtitle: data.skillsSection?.subtitle || 'TECH STACK',
        title: data.skillsSection?.title || 'Skills',
        skillsText: this.formatSkills(data.skillsSection?.skills || []),
        skillTagsText: this.formatSkillTags(data.skillsSection?.skillTags || []),
      },
      projectsSection: {
        subtitle: data.projectsSection?.subtitle || 'PROJECTS',
        title: data.projectsSection?.title || 'Selected Work',
        description: data.projectsSection?.description || '',
        projectsJson: JSON.stringify(data.projectsSection?.projects || [], null, 2),
      },
      seo: {
        metaTitle: data.seo?.metaTitle || '',
        metaDescription: data.seo?.metaDescription || '',
        metaKeywordsText: (data.seo?.metaKeywords || []).join(', '),
        ogImage: {
          url: data.seo?.ogImage?.url || '',
          alt: data.seo?.ogImage?.alt || '',
        },
      },
      theme: {
        primaryColor: data.theme?.primaryColor || '#2f947f',
        secondaryColor: data.theme?.secondaryColor || '#f3f4f6',
        backgroundColor: data.theme?.backgroundColor || '#f4f1ea',
        logo: {
          url: data.theme?.logo?.url || '',
          alt: data.theme?.logo?.alt || '',
        },
        resumeFile: data.theme?.resumeFile || '/Resume.pdf',
      },
    });
  }

  private buildPayload(): PortfolioContentPayload {
    const value = this.contentForm.getRawValue();

    return {
      hero: {
        greeting: value.hero.greeting,
        name: value.hero.name,
        title: value.hero.title,
        shortDescription: value.hero.shortDescription,
        profileImage: value.hero.profileImage,
        email: value.hero.email,
        phone: value.hero.phone,
        location: value.hero.location,
        primaryButton: value.hero.primaryButton,
        secondaryButton: value.hero.secondaryButton,
        isOpenToWork: value.hero.isOpenToWork,
        openToWorkBadge: value.hero.openToWorkBadge,
        stats: this.parseStats(value.hero.statsText),
      },
      skillsSection: {
        subtitle: value.skillsSection.subtitle,
        title: value.skillsSection.title,
        skills: this.parseSkills(value.skillsSection.skillsText),
        skillTags: this.parseSkillTags(value.skillsSection.skillTagsText),
      },
      projectsSection: {
        subtitle: value.projectsSection.subtitle,
        title: value.projectsSection.title,
        description: value.projectsSection.description,
        projects: this.parseProjects(value.projectsSection.projectsJson),
      },
      seo: {
        metaTitle: value.seo.metaTitle,
        metaDescription: value.seo.metaDescription,
        metaKeywords: this.parseCsv(value.seo.metaKeywordsText),
        ogImage: value.seo.ogImage,
      },
      theme: value.theme,
    };
  }

  private parseStats(raw: string): HeroStat[] {
    return this.lines(raw).map((line, index) => {
      const [value = '', label = '', icon = '', displayOrder = `${index + 1}`] = line.split('|').map(part => part.trim());
      return {
        value,
        label,
        icon,
        displayOrder: Number(displayOrder) || index + 1,
      };
    });
  }

  private parseSkills(raw: string): SkillContent[] {
    return this.lines(raw).map((line, index) => {
      const [name = '', icon = '', category = '', displayOrder = `${index + 1}`, isVisible = 'true'] = line.split('|').map(part => part.trim());
      return {
        name,
        icon,
        category,
        displayOrder: Number(displayOrder) || index + 1,
        isVisible: this.toBoolean(isVisible),
      };
    });
  }

  private parseSkillTags(raw: string): SkillTagContent[] {
    return this.lines(raw).map((line, index) => {
      const [name = '', displayOrder = `${index + 1}`, isVisible = 'true'] = line.split('|').map(part => part.trim());
      return {
        name,
        displayOrder: Number(displayOrder) || index + 1,
        isVisible: this.toBoolean(isVisible),
      };
    });
  }

  private parseProjects(raw: string): ProjectContent[] {
    try {
      const parsed = JSON.parse(raw || '[]');
      if (!Array.isArray(parsed)) {
        throw new Error();
      }
      return parsed;
    } catch {
      throw new Error('Projects JSON must be a valid array.');
    }
  }

  private parseProjectsSafe(): ProjectContent[] {
    try {
      return this.parseProjects(this.contentForm.controls.projectsSection.controls.projectsJson.value);
    } catch {
      return [];
    }
  }

  private formatStats(stats: HeroStat[]): string {
    return stats.map((item, index) => `${item.value || ''} | ${item.label || ''} | ${item.icon || ''} | ${item.displayOrder ?? index + 1}`).join('\n');
  }

  private formatSkills(skills: SkillContent[]): string {
    return skills.map((item, index) => `${item.name || ''} | ${item.icon || ''} | ${item.category || ''} | ${item.displayOrder ?? index + 1} | ${item.isVisible ?? true}`).join('\n');
  }

  private formatSkillTags(tags: SkillTagContent[]): string {
    return tags.map((item, index) => `${item.name || ''} | ${item.displayOrder ?? index + 1} | ${item.isVisible ?? true}`).join('\n');
  }

  private parseCsv(raw: string): string[] {
    return raw.split(',').map(item => item.trim()).filter(Boolean);
  }

  private lines(raw: string): string[] {
    return raw.split('\n').map(line => line.trim()).filter(Boolean);
  }

  private toBoolean(raw: string): boolean {
    return !['false', '0', 'no', 'hidden'].includes(raw.toLowerCase());
  }
}

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
import { ToastService } from '../../../../services/toast.service';

type EditorTab = 'hero' | 'skills' | 'projects' | 'seo' | 'theme';

@Component({
  selector: 'app-admin-portfolio-edit',
  standalone: true,
  imports: [DatePipe, NgClass, NgFor, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './portfolio-edit.component.html',
  styleUrl: './portfolio-edit.component.css',
})
export class PortfolioEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private adminApi = inject(AdminApiService);
  private toast = inject(ToastService);

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
          this.toast.info('No editable content was returned. You can create the first draft from this editor.');
        },
      });
  }

  saveContent(): void {
    if (this.contentForm.invalid) {
      this.contentForm.markAllAsTouched();
      this.toast.error('Please fix the highlighted fields before saving.');
      return;
    }

    let payload: PortfolioContentPayload;
    try {
      payload = this.buildPayload();
    } catch (error) {
      this.toast.error(error instanceof Error ? error.message : 'Could not prepare content payload.');
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
          this.toast.success(this.content()?._id ? 'Content saved successfully.' : 'Draft content created successfully.');
        },
        error: error => this.toast.error(error?.error?.message || 'Could not save content. Please confirm the portfolio-content admin endpoint is available.'),
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
          this.toast.success(this.isPublished() ? 'Portfolio content published.' : 'Portfolio content unpublished.');
        },
        error: error => this.toast.error(error?.error?.message || 'Could not update publish status.'),
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
          url: (
            (data.hero?.profileImage as any)?.url ||
            (data.hero?.profileImage as any)?.filePath ||
            (data.hero?.profileImage as any)?.mediaId?.filePath ||
            ''
          ),
          alt: (data.hero?.profileImage as any)?.alt || '',
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
          url: (
            (data.seo?.ogImage as any)?.url ||
            (data.seo?.ogImage as any)?.filePath ||
            (data.seo?.ogImage as any)?.mediaId?.filePath ||
            ''
          ),
          alt: (data.seo?.ogImage as any)?.alt || '',
        },
      },
      theme: {
        primaryColor: data.theme?.primaryColor || '#2f947f',
        secondaryColor: data.theme?.secondaryColor || '#f3f4f6',
        backgroundColor: data.theme?.backgroundColor || '#f4f1ea',
        logo: {
          url: (
            (data.theme?.logo as any)?.url ||
            (data.theme?.logo as any)?.filePath ||
            (data.theme?.logo as any)?.mediaId?.filePath ||
            ''
          ),
          alt: (data.theme?.logo as any)?.alt || '',
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

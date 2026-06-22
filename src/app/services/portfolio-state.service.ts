import { Injectable, signal, computed, effect } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { PortfolioApiService } from './portfolio-api.service';
import { ThemeService } from './theme.service';
import { PortfolioData, ThemeSection } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioStateService {
  portfolioData = signal<PortfolioData | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed helper signals for specific slices of data
  hero = computed(() => this.portfolioData()?.hero);
  expertise = computed(() => {
    const list = this.portfolioData()?.expertiseSection?.expertise || [];
    return [...list]
      .filter(item => item.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  });
  expertiseSectionMeta = computed(() => this.portfolioData()?.expertiseSection);

  skills = computed(() => {
    const list = this.portfolioData()?.skillsSection?.skills || [];
    return [...list]
      .filter(item => item.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  });
  skillTags = computed(() => {
    const list = this.portfolioData()?.skillsSection?.skillTags || [];
    return [...list]
      .filter(item => item.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  });
  skillsSectionMeta = computed(() => this.portfolioData()?.skillsSection);

  experience = computed(() => {
    const list = this.portfolioData()?.experienceSection?.experience || [];
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  });
  experienceSectionMeta = computed(() => this.portfolioData()?.experienceSection);

  projects = computed(() => {
    const list = this.portfolioData()?.projectsSection?.projects || [];
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  });
  projectsSectionMeta = computed(() => this.portfolioData()?.projectsSection);

  education = computed(() => {
    const list = this.portfolioData()?.educationSection?.education || [];
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder);
  });
  educationSectionMeta = computed(() => this.portfolioData()?.educationSection);

  contactSectionMeta = computed(() => this.portfolioData()?.contactSection);
  contactItems = computed(() => this.portfolioData()?.contactSection?.contact?.items || []);

  branding = computed(() => this.portfolioData()?.branding);
  navigation = computed(() => {
    const navs = this.portfolioData()?.navigation || [];
    return [...navs]
      .filter(item => item.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  });
  footer = computed(() => this.portfolioData()?.footer);
  socialLinks = computed(() => this.portfolioData()?.socialLinks || []);
  sectionConfig = computed(() => this.portfolioData()?.sectionConfig || []);

  constructor(
    private apiService: PortfolioApiService,
    private titleService: Title,
    private metaService: Meta,
    private themeService: ThemeService
  ) {
    // Automatically apply theme color overrides when portfolio data changes or dark mode is toggled
    effect(() => {
      const data = this.portfolioData();
      const isDark = this.themeService.isDark();
      if (data?.theme) {
        this.applyTheme(data.theme, isDark);
      }
    });
  }

  loadPortfolio(slug: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.getPortfolioBySlug(slug).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.portfolioData.set(response.data);
          this.updateSeo(response.data);
        } else {
          this.error.set(response.message || 'Failed to load portfolio content.');
          this.portfolioData.set(null);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          err.error?.message || 
          `Unable to retrieve portfolio for "${slug}". Please check the URL or try again later.`
        );
        this.portfolioData.set(null);
        this.loading.set(false);
      }
    });
  }

  isSectionVisible(key: string): boolean {
    const config = this.sectionConfig().find(item => item.key === key);
    return config ? config.isVisible : true;
  }

  private updateSeo(data: PortfolioData): void {
    const seo = data.seo;
    if (!seo) return;

    if (seo.metaTitle) {
      this.titleService.setTitle(seo.metaTitle);
      this.metaService.updateTag({ property: 'og:title', content: seo.metaTitle });
    }

    if (seo.metaDescription) {
      this.metaService.updateTag({ name: 'description', content: seo.metaDescription });
      this.metaService.updateTag({ property: 'og:description', content: seo.metaDescription });
    }

    if (seo.metaKeywords && seo.metaKeywords.length > 0) {
      this.metaService.updateTag({ name: 'keywords', content: seo.metaKeywords.join(', ') });
    }

    if (seo.ogImage?.url) {
      this.metaService.updateTag({ property: 'og:image', content: seo.ogImage.url });
    }
  }

  private applyTheme(themeConfig: ThemeSection, isDark: boolean): void {
    const root = document.documentElement;

    if (themeConfig.primaryColor) {
      const hsl = this.hexToHsl(themeConfig.primaryColor);
      root.style.setProperty('--primary', hsl);
      root.style.setProperty('--ring', hsl);
      root.style.setProperty('--accent', hsl);
    }

    if (themeConfig.secondaryColor) {
      const hsl = this.hexToHsl(themeConfig.secondaryColor);
      root.style.setProperty('--secondary', hsl);
    }

    // Only override background in light mode; allow CSS default background in dark mode
    if (!isDark && themeConfig.backgroundColor) {
      root.style.setProperty('--background', this.hexToHsl(themeConfig.backgroundColor));
    } else {
      root.style.removeProperty('--background');
    }
  }

  private hexToHsl(hex: string): string {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
  }
}

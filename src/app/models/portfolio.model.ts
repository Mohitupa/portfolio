export interface PortfolioResponse {
  success: boolean;
  message: string;
  data: PortfolioData;
}

export interface PortfolioData {
  _id: string;
  portfolio: {
    id: string;
    name: string;
    slug: string;
  };
  hero: HeroSection;
  expertiseSection: ExpertiseSection;
  skillsSection: SkillsSection;
  experienceSection: ExperienceSection;
  projectsSection: ProjectsSection;
  educationSection: EducationSection;
  contactSection: ContactSection;
  seo: SeoSection;
  branding: BrandingSection;
  footer: FooterSection;
  theme: ThemeSection;
  navigation: NavigationItem[];
  sectionConfig: SectionConfigItem[];
  socialLinks: SocialLinkItem[];
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaId {
  _id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
}

export interface MediaField {
  mediaId?: MediaId;
  filePath?: string;
  url?: string;
  alt?: string;
}

export interface HeroSection {
  greeting: string;
  name: string;
  title: string;
  shortDescription: string;
  profileImage: {
    mediaId?: MediaId;
    filePath?: string;
    url?: string;
    alt: string;
  };
  email: string;
  phone: string;
  location: string;
  primaryButton: {
    text: string;
    link: string;
  };
  secondaryButton: {
    text: string;
    link: string;
  };
  isOpenToWork: boolean;
  openToWorkBadge: {
    text: string;
    icon: string;
  };
  stats: StatItem[];
}

export interface StatItem {
  value: string;
  label: string;
  icon: string;
}

export interface ExpertiseSection {
  subtitle: string;
  title: string;
  expertise: ExpertiseItem[];
}

export interface ExpertiseItem {
  title: string;
  icon: string;
  description: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface SkillsSection {
  subtitle: string;
  title: string;
  skills: SkillItem[];
  skillTags: SkillTagItem[];
}

export interface SkillItem {
  name: string;
  icon: string;
  category: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface SkillTagItem {
  name: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface ExperienceSection {
  subtitle: string;
  title: string;
  experience: ExperienceItem[];
}

export interface ExperienceItem {
  company: string;
  companyLogo: {
    mediaId?: MediaId;
    filePath?: string;
    url?: string;
    alt: string;
  };
  position: string;
  employmentType: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  location: string;
  highlights: string[];
  displayOrder: number;
}

export interface ProjectsSection {
  subtitle: string;
  title: string;
  description: string;
  projects: ProjectItem[];
}

export interface ProjectItem {
  slug: string;
  title: string;
  year: string;
  status: string;
  coverImage: {
    mediaId?: MediaId;
    filePath?: string;
    url?: string;
    alt: string;
  };
  gallery: string[];
  description: string;
  features: string[];
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  displayOrder: number;
}

export interface EducationSection {
  subtitle: string;
  title: string;
  education: EducationItem[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  institutionLogo: {
    mediaId?: MediaId;
    filePath?: string;
    url?: string;
    alt: string;
  };
  location: string;
  startYear: string;
  endYear: string;
  grade: string;
  displayOrder: number;
}

export interface ContactSection {
  subtitle: string;
  title: string;
  description: string;
  contact: {
    items: ContactItem[];
  };
}

export interface ContactItem {
  key: string;
  label: string;
  value: string;
  icon: string;
  url: string;
}

export interface SeoSection {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImage: {
    mediaId?: MediaId;
    filePath?: string;
    url?: string;
    alt: string;
  };
}

export interface BrandingSection {
  logoText: string;
  logoImage: {
    mediaId?: MediaId;
    filePath?: string;
    url?: string;
    alt: string;
  };
  favicon: {
    mediaId?: MediaId;
    filePath?: string;
    url?: string;
    alt: string;
  };
}

export interface FooterSection {
  name: string;
  designation: string;
  location: string;
}

export interface ThemeSection {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  logo: {
    mediaId?: MediaId;
    filePath?: string;
    url?: string;
    alt: string;
  };
  resumeFile: string | { mediaId?: MediaId; filePath?: string; url?: string };
}

export interface NavigationItem {
  label: string;
  link: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface SectionConfigItem {
  key: string;
  name: string;
  displayOrder: number;
  isVisible: boolean;
  showInNavigation: boolean;
  editable: boolean;
  icon: string;
}

export interface SocialLinkItem {
  platform: string;
  icon: string;
  url: string;
}

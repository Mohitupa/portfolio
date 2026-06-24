export interface DashboardStats {
  totalPortfolios: number;
  activePortfolios: number;
  publishedPortfolios: number;
  draftPortfolios: number;
  totalAdmins: number;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StatsResponse {
  success: boolean;
  message?: string;
  data: DashboardStats;
}

export interface MessagesResponse {
  success: boolean;
  message?: string;
  data: ContactMessage[];
}

export interface MessageResponse {
  success: boolean;
  message?: string;
  data: ContactMessage;
}

export interface Portfolio {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioPayload {
  name: string;
  slug: string;
}

export interface PortfolioResponse {
  success: boolean;
  message?: string;
  data: Portfolio;
}

export interface PortfoliosResponse {
  success: boolean;
  message?: string;
  data: Portfolio[];
}

export interface ImageField {
  // backend expects mediaId (ObjectId) references
  mediaId?: string;
  alt?: string;

  // keep url for backward compatibility with any existing editor fields
  url?: string;
}

export interface ButtonField {
  text: string;
  link: string;
}

export interface HeroStat {
  value: string;
  label: string;
  icon?: string;
  displayOrder?: number;
}

export interface HeroContent {
  greeting: string;
  name: string;
  title: string;
  shortDescription: string;
  profileImage: ImageField;
  email: string;
  phone: string;
  location: string;
  primaryButton: ButtonField;
  secondaryButton: ButtonField;
  isOpenToWork: boolean;
  openToWorkBadge?: {
    text: string;
    icon?: string;
  };
  stats?: HeroStat[];
}

export interface SkillContent {
  name?: string;
  icon?: string;
  category?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface SkillTagContent {
  name?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface SkillsContent {
  subtitle?: string;
  title?: string;
  skills?: SkillContent[];
  skillTags?: SkillTagContent[];
}

export interface ProjectContent {
  slug?: string;
  title?: string;
  year?: string;
  status?: string;
  coverImage?: ImageField;
  gallery?: ImageField[];
  description?: string;
  features?: string[];
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  displayOrder?: number;
}

export interface ProjectsContent {
  subtitle?: string;
  title?: string;
  description?: string;
  projects?: ProjectContent[];
}

export interface SeoContent {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: ImageField;
}

export interface ThemeContent {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  logo?: ImageField;
  // backend expects mediaId (pdf) reference
  resumeFile?: string;
}

export interface PortfolioContent {
  _id?: string;
  portfolioId?: string | Portfolio;
  portfolio?: {
    id: string;
    name: string;
    slug: string;
  };
  hero?: HeroContent;
  skillsSection?: SkillsContent;
  projectsSection?: ProjectsContent;
  seo?: SeoContent;
  theme?: ThemeContent;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface PortfolioContentPayload {
  hero?: HeroContent;
  skillsSection?: SkillsContent;
  projectsSection?: ProjectsContent;
  seo?: SeoContent;
  theme?: ThemeContent;
}

export interface PortfolioContentResponse {
  success: boolean;
  message?: string;
  data: PortfolioContent;
}

export interface MediaItem {
  _id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaResponse {
  success: boolean;
  message?: string;
  data: MediaItem;
}

export interface MediaListResponse {
  success: boolean;
  message?: string;
  data: MediaItem[];
}

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';

export interface AdminUserItem {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserPayload {
  name: string;
  email: string;
  password?: string;
  role: AdminRole;
  isActive: boolean;
}

export interface AdminUserResponse {
  success: boolean;
  message?: string;
  data: AdminUserItem;
}

export interface AdminUsersResponse {
  success: boolean;
  message?: string;
  data: AdminUserItem[];
}

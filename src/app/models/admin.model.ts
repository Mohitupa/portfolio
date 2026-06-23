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

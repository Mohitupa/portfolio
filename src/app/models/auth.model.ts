export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: AdminUser;
  };
}

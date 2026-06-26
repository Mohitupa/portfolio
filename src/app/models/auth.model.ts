export interface AdminUser {
  id: string;
  email: string;
  name: string;

  /**
   * Roles returned by backend login: e.g. ["SUPER_ADMIN"]
   */
  roles: string[];

  /**
   * Permissions returned by backend login:
   * e.g. ["dashboard.read", "portfolio.read", ...]
   */
  permissions: string[];

  /**
   * Backward-compatibility (older backend/UI may still provide a single role).
   */
  role?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    accessToken: string;
    user: AdminUser;
  };
}

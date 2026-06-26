import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdminUserPayload,
  AdminUserResponse,
  AdminUsersResponse,
  MessagesResponse,
  MediaListResponse,
  MediaResponse,
  MessageResponse,
  PortfolioContentPayload,
  PortfolioContentResponse,
  PortfolioPayload,
  PortfolioResponse,
  PortfoliosResponse,
  StatsResponse,
} from '../models/admin.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private apiBaseUrl = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.apiBaseUrl}/dashboard/stats`);
  }

  getContactMessages(): Observable<MessagesResponse> {
    return this.http.get<MessagesResponse>(`${this.apiBaseUrl}/contact-messages`);
  }

  getContactMessage(id: string): Observable<MessageResponse> {
    return this.http.get<MessageResponse>(`${this.apiBaseUrl}/contact-messages/${id}`);
  }

  markContactMessageRead(id: string): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(`${this.apiBaseUrl}/contact-messages/${id}/read`, {});
  }

  deleteContactMessage(id: string): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.apiBaseUrl}/contact-messages/${id}`);
  }

  getPortfolios(): Observable<PortfoliosResponse> {
    return this.http.get<PortfoliosResponse>(`${this.apiBaseUrl}/portfolios`);
  }

  getPortfolio(slugOrId: string): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>(`${this.apiBaseUrl}/portfolios/${slugOrId}`);
  }

  createPortfolio(payload: PortfolioPayload): Observable<PortfolioResponse> {
    return this.http.post<PortfolioResponse>(`${this.apiBaseUrl}/portfolios`, payload);
  }

  updatePortfolio(id: string, payload: Partial<PortfolioPayload>): Observable<PortfolioResponse> {
    return this.http.patch<PortfolioResponse>(`${this.apiBaseUrl}/portfolios/${id}`, payload);
  }

  deletePortfolio(id: string): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.apiBaseUrl}/portfolios/${id}`);
  }

  togglePortfolioStatus(id: string, isActive: boolean): Observable<PortfolioResponse> {
    return this.http.patch<PortfolioResponse>(`${this.apiBaseUrl}/portfolios/${id}/status`, { isActive });
  }

  getPortfolioContent(slugOrPortfolioId: string): Observable<PortfolioContentResponse> {
    return this.http.get<PortfolioContentResponse>(`${this.apiBaseUrl}/portfolio-content/${slugOrPortfolioId}`);
  }

  getAdminPortfolioContent(portfolioId: string): Observable<PortfolioContentResponse> {
    return this.http.get<PortfolioContentResponse>(`${this.apiBaseUrl}/portfolio-content/${portfolioId}/edit`);
  }

  createPortfolioContent(portfolioId: string, payload: PortfolioContentPayload): Observable<PortfolioContentResponse> {
    return this.http.post<PortfolioContentResponse>(`${this.apiBaseUrl}/portfolio-content`, {
      portfolioId,
      ...payload,
    });
  }

  updatePortfolioContent(portfolioId: string, payload: PortfolioContentPayload): Observable<PortfolioContentResponse> {
    return this.http.patch<PortfolioContentResponse>(`${this.apiBaseUrl}/portfolio-content/${portfolioId}`, payload);
  }

  publishPortfolioContent(portfolioId: string): Observable<PortfolioContentResponse> {
    return this.http.patch<PortfolioContentResponse>(`${this.apiBaseUrl}/portfolio-content/${portfolioId}/publish`, {});
  }

  unpublishPortfolioContent(portfolioId: string): Observable<PortfolioContentResponse> {
    return this.http.patch<PortfolioContentResponse>(`${this.apiBaseUrl}/portfolio-content/${portfolioId}/unpublish`, {});
  }

  getMedia(): Observable<MediaListResponse> {
    return this.http.get<MediaListResponse>(`${this.apiBaseUrl}/media`);
  }

  getMediaById(id: string): Observable<MediaResponse> {
    return this.http.get<MediaResponse>(`${this.apiBaseUrl}/media/${id}`);
  }

  uploadMedia(file: File): Observable<MediaResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<MediaResponse>(`${this.apiBaseUrl}/media/upload`, formData);
  }

  deleteMedia(id: string): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.apiBaseUrl}/media/${id}`);
  }

  getAdminUsers(): Observable<AdminUsersResponse> {
    return this.http.get<AdminUsersResponse>(`${this.apiBaseUrl}/admin-users`);
  }

  getAdminUser(id: string): Observable<AdminUserResponse> {
    return this.http.get<AdminUserResponse>(`${this.apiBaseUrl}/admin-users/${id}`);
  }

  createAdminUser(payload: AdminUserPayload): Observable<AdminUserResponse> {
    return this.http.post<AdminUserResponse>(`${this.apiBaseUrl}/admin-users`, payload);
  }

  updateAdminUser(id: string, payload: Partial<AdminUserPayload>): Observable<AdminUserResponse> {
    return this.http.patch<AdminUserResponse>(`${this.apiBaseUrl}/admin-users/${id}`, payload);
  }

  deleteAdminUser(id: string): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.apiBaseUrl}/admin-users/${id}`);
  }

  // RBAC: Roles
  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/roles`);
  }

  // Backward compatible alias (in case components use old name)
  getRolesList(): Observable<any> {
    return this.getRoles();
  }

  getRoleById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/roles/${id}`);
  }

  createRole(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/roles`, payload);
  }

  updateRole(id: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiBaseUrl}/roles/${id}`, payload);
  }

  deleteRole(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/roles/${id}`);
  }

  // RBAC: Permissions
  getPermissions(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/permissions`);
  }

  getPermissionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/permissions/${id}`);
  }

  createPermission(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/permissions`, payload);
  }

  updatePermission(id: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.apiBaseUrl}/permissions/${id}`, payload);
  }

  deletePermission(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiBaseUrl}/permissions/${id}`);
  }

  // RBAC: Role -> Permissions
  getRolePermissions(roleId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/role-permissions/${roleId}`);
  }

  setRolePermissions(roleId: string, payload: { permissionIds: string[] }): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/role-permissions/${roleId}`, payload);
  }

  // RBAC: User -> Roles
  getUserRoles(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/user-roles/${userId}`);
  }

  setUserRoles(userId: string, payload: { roleIds: string[] }): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/user-roles/${userId}`, payload);
  }

  getPublicAssetUrl(filePath: string): string {
    if (!filePath) {
      return '';
    }

    if (/^https?:\/\//i.test(filePath)) {
      return filePath;
    }

    const apiOrigin = this.apiBaseUrl.replace(/\/api\/?$/, '');
    const normalizedPath = filePath.replace(/\\/g, '/').replace(/^\/+/, '');

    return `${apiOrigin}/${normalizedPath}`;
  }
}

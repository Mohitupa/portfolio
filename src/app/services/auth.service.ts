import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, of, catchError } from 'rxjs';
import { AdminUser, LoginResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBaseUrl = environment.API_BASE_URL;
  private readonly userKey = 'admin_user';

  // State Signals
  currentUser = signal<AdminUser | null>(null);
  authLoaded = signal<boolean>(false);
  private accessToken = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    this.currentUser.set(this.getStoredUser());

    // Fetch user profile using the stored token
    this.http
      .get(
        `${this.apiBaseUrl}/auth/me`,
        {
          withCredentials: true
        }
      ).pipe(
        tap((res: any) => {
          const user = this.extractUser(res);

          if (user) {
            this.setUser(user);
          } else {
            this.clearSession();
          }

          this.authLoaded.set(true);
        }),
        catchError((error) => {
          if (error?.status === 401 || error?.status === 403) {
            this.logout();
          }

          this.authLoaded.set(true);
          return of(null);
        })
      ).subscribe();
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBaseUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response && response.success && response.data) {
          this.setAccessToken(response.data.accessToken);

          const user = this.extractUser(response.data.user);
          if (user) {
            this.setUser(user);
          } else {
            this.clearSession();
          }
        }
      })
    );
  }

  logout(): void {

    this.http
      .post(
        `${this.apiBaseUrl}/auth/logout`,
        {},
        {
          withCredentials: true
        }
      )
      .subscribe({
        next: () => { },
        error: () => { }
      });

    this.clearSession();

    this.router.navigate(
      ['/admin/login']
    );
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null || this.getAccessToken() !== null;
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  setAccessToken(token: string): void {
    this.accessToken.set(token);
  }

  getPermissions(): string[] {
    return this.currentUser()?.permissions ?? [];
  }

  getRoles(): string[] {
    return this.currentUser()?.roles ?? [];
  }

  hasPermission(permission: string): boolean {
    if (!permission) return false;
    return this.getPermissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    if (!permissions || permissions.length === 0) return false;
    const userPerms = new Set(this.getPermissions());
    return permissions.some(p => userPerms.has(p));
  }

  hasAllPermissions(permissions: string[]): boolean {
    if (!permissions || permissions.length === 0) return true;
    const userPerms = new Set(this.getPermissions());
    return permissions.every(p => userPerms.has(p));
  }

  private setUser(user: AdminUser): void {
    this.currentUser.set(user);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private getStoredUser(): AdminUser | null {
    const rawUser = localStorage.getItem(this.userKey);

    if (!rawUser) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawUser) as Partial<AdminUser> | null;
      if (!parsed) return null;

      // ensure required arrays exist even if older data was stored
      const normalized = this.normalizeUser(parsed);
      if (!normalized) return null;

      return normalized;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  private normalizeUser(user: any): AdminUser | null {
    if (!user) return null;

    const id = user.id || user._id;
    if (!id) return null;

    const roles: string[] = Array.isArray(user.roles)
      ? user.roles
      : (typeof user.role === 'string' && user.role ? [user.role] : []);

    const permissions: string[] = Array.isArray(user.permissions) ? user.permissions : [];

    // If permissions are not present, keep empty list; UI/guards will treat as unauthorized
    return {
      ...user,
      id,
      roles,
      permissions
    } as AdminUser;
  }

  private extractUser(response: any): AdminUser | null {
    const user = response?.data || response?.user || response || null;
    if (!user) return null;

    return this.normalizeUser(user);
  }

  refreshToken() {
    return this.http.post<any>(
      `${this.apiBaseUrl}/auth/refresh-token`,
      {},
      {
        withCredentials: true
      }
    );
  }
}

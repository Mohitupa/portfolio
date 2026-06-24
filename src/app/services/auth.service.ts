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
          this.setUser(response.data.user);
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
      return JSON.parse(rawUser) as AdminUser;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  private extractUser(response: any): AdminUser | null {
    const user = response?.data || response?.user || null;

    if (!user) {
      return null;
    }

    return {
      ...user,
      id: user.id || user._id
    };
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

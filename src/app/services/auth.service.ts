import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, of, catchError } from 'rxjs';
import { AdminUser, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBaseUrl = 'https://portfolio-api-ecru-eight.vercel.app/api';
  
  // State Signals
  currentUser = signal<AdminUser | null>(null);
  authLoaded = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      // Fetch user profile using the stored token
      this.http.get<any>(`${this.apiBaseUrl}/auth/me`).pipe(
        tap((res: any) => {
          if (res && res.success && res.data) {
            this.currentUser.set(res.data);
          } else if (res && res.user) {
            this.currentUser.set(res.user);
          } else {
            this.logout();
          }
          this.authLoaded.set(true);
        }),
        catchError(() => {
          this.logout();
          this.authLoaded.set(true);
          return of(null);
        })
      ).subscribe();
    } else {
      this.authLoaded.set(true);
    }
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBaseUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response && response.success && response.data) {
          this.setToken(response.data.token);
          this.currentUser.set(response.data.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('admin_jwt_token');
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('admin_jwt_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('admin_jwt_token', token);
  }
}

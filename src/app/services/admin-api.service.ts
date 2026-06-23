import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MessagesResponse,
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
}

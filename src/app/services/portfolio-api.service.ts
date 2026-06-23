import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioResponse } from '../models/portfolio.model';
import { environment } from '../../environments/environment';

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioApiService {
  private baseUrl = `${environment.API_BASE_URL}/portfolio-content`;
  private contactUrl = `${environment.API_BASE_URL}/contact`;

  constructor(private http: HttpClient) {}

  getPortfolioBySlug(slug: string): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>(`${this.baseUrl}/${slug}`);
  }

  sendContactMessage(payload: ContactMessagePayload): Observable<ContactMessageResponse> {
    return this.http.post<ContactMessageResponse>(this.contactUrl, payload);
  }
}

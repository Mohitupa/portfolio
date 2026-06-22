import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatsResponse, MessagesResponse } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private apiBaseUrl = 'https://portfolio-api-ecru-eight.vercel.app/api';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.apiBaseUrl}/dashboard/stats`);
  }

  getContactMessages(): Observable<MessagesResponse> {
    return this.http.get<MessagesResponse>(`${this.apiBaseUrl}/contact-messages`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioResponse } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioApiService {
  private baseUrl = 'https://portfolio-api-ecru-eight.vercel.app/api/portfolio-content';

  constructor(private http: HttpClient) {}

  getPortfolioBySlug(slug: string): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>(`${this.baseUrl}/${slug}`);
  }
}

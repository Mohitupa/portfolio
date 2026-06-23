import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../../services/admin-api.service';
import { AuthService } from '../../../../services/auth.service';
import { DashboardStats, ContactMessage } from '../../../../models/admin.model';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  recentMessages = signal<ContactMessage[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  currentDate = new Date();

  constructor(
    private adminApi: AdminApiService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      stats: this.adminApi.getDashboardStats(),
      messages: this.adminApi.getContactMessages()
    }).subscribe({
      next: (result) => {
        if (result.stats && result.stats.success) {
          this.stats.set(result.stats.data);
        }
        if (result.messages && result.messages.success) {
          // Slice first 5 recent messages
          this.recentMessages.set(result.messages.data.slice(0, 5));
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        const message = 'Failed to load dashboard metrics. Please refresh the page.';
        this.error.set(message);
        this.toast.error(message);
        this.loading.set(false);
      }
    });
  }

  getGreeting(): string {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}

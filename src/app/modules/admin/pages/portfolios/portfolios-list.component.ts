import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Portfolio } from '../../../../models/admin.model';
import { AdminApiService } from '../../../../services/admin-api.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-admin-portfolios-list',
  standalone: true,
  imports: [DatePipe, NgClass, NgFor, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './portfolios-list.component.html',
  styleUrl: './portfolios-list.component.css',
})
export class PortfoliosListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminApi = inject(AdminApiService);
  private toast = inject(ToastService);

  portfolios = signal<Portfolio[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  notice = signal('');
  showCreatePanel = signal(false);
  actionId = signal('');

  activeCount = computed(() => this.portfolios().filter(portfolio => portfolio.isActive).length);
  inactiveCount = computed(() => this.portfolios().filter(portfolio => !portfolio.isActive).length);

  createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    slug: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(/^[a-z0-9-]+$/)]],
  });

  ngOnInit(): void {
    this.loadPortfolios();
  }

  loadPortfolios(): void {
    this.loading.set(true);
    this.error.set('');

    this.adminApi.getPortfolios()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => this.portfolios.set(response.data ?? []),
        error: () => {
          const message = 'Could not load portfolios. Please confirm the API is running and your session is valid.';
          this.error.set(message);
          this.toast.error(message);
        },
      });
  }

  openCreatePanel(): void {
    this.notice.set('');
    this.error.set('');
    this.showCreatePanel.set(true);
  }

  closeCreatePanel(): void {
    this.showCreatePanel.set(false);
    this.createForm.reset();
  }

  createPortfolio(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.notice.set('');

    this.adminApi.createPortfolio(this.createForm.getRawValue())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: response => {
          this.portfolios.update(portfolios => [response.data, ...portfolios]);
          this.toast.success('Portfolio created successfully.');
          this.closeCreatePanel();
        },
        error: error => this.toast.error(error?.error?.message || 'Could not create portfolio. Check the slug and try again.'),
      });
  }

  toggleStatus(portfolio: Portfolio): void {
    const id = this.portfolioId(portfolio);
    this.actionId.set(id);
    this.error.set('');
    this.notice.set('');

    this.adminApi.togglePortfolioStatus(id, !portfolio.isActive)
      .pipe(finalize(() => this.actionId.set('')))
      .subscribe({
        next: response => {
          this.portfolios.update(portfolios => portfolios.map(item => this.portfolioId(item) === id ? response.data : item));
          this.toast.success(`Portfolio ${response.data.isActive ? 'activated' : 'deactivated'} successfully.`);
        },
        error: () => this.toast.error('Could not update status. The backend may not have the status endpoint yet.'),
      });
  }

  deletePortfolio(portfolio: Portfolio): void {
    const id = this.portfolioId(portfolio);
    const confirmed = window.confirm(`Delete "${portfolio.name}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    this.actionId.set(id);
    this.error.set('');
    this.notice.set('');

    this.adminApi.deletePortfolio(id)
      .pipe(finalize(() => this.actionId.set('')))
      .subscribe({
        next: () => {
          this.portfolios.update(portfolios => portfolios.filter(item => this.portfolioId(item) !== id));
          this.toast.success('Portfolio deleted successfully.');
        },
        error: () => this.toast.error('Could not delete portfolio. The backend may not have the delete endpoint yet.'),
      });
  }

  portfolioId(portfolio: Portfolio): string {
    return portfolio._id || portfolio.id || portfolio.slug;
  }

  trackPortfolio = (_: number, portfolio: Portfolio): string => this.portfolioId(portfolio);
}

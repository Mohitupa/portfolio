import { DatePipe, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Portfolio } from '../../../../models/admin.model';
import { AdminApiService } from '../../../../services/admin-api.service';

@Component({
  selector: 'app-admin-portfolio-edit',
  standalone: true,
  imports: [DatePipe, NgIf, ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6 space-y-6 max-w-5xl mx-auto">
      <a routerLink="/admin/portfolios" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        <span>Back to portfolios</span>
      </a>

      <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-widest font-bold text-primary mb-2">Portfolio CMS</p>
          <h1 class="font-serif text-3xl font-extrabold text-foreground tracking-tight">Edit Portfolio</h1>
          <p class="text-sm text-muted-foreground mt-1 font-medium">Update the portfolio shell before editing content sections in Phase 4.</p>
        </div>

        <span
          *ngIf="portfolio()"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border self-start"
          [class.bg-primary]="portfolio()?.isActive"
          [class.text-primary-foreground]="portfolio()?.isActive"
          [class.border-primary]="portfolio()?.isActive"
          [class.bg-secondary]="!portfolio()?.isActive"
          [class.text-muted-foreground]="!portfolio()?.isActive"
          [class.border-border]="!portfolio()?.isActive"
        >
          <span class="h-2 w-2 rounded-full" [class.bg-primary-foreground]="portfolio()?.isActive" [class.bg-muted-foreground]="!portfolio()?.isActive"></span>
          {{ portfolio()?.isActive ? 'Active' : 'Inactive' }}
        </span>
      </div>

      <div *ngIf="notice()" class="rounded-2xl border border-primary/20 bg-primary/10 text-primary px-4 py-3 text-sm font-semibold">
        {{ notice() }}
      </div>

      <div *ngIf="error()" class="rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive px-4 py-3 text-sm font-semibold">
        {{ error() }}
      </div>

      <div *ngIf="loading()" class="h-80 rounded-3xl bg-muted/40 animate-pulse"></div>

      <section *ngIf="!loading()" class="grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-6">
        <form
          [formGroup]="editForm"
          (ngSubmit)="savePortfolio()"
          class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-sm"
        >
          <div class="border-b border-border/80 pb-5 mb-5">
            <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Profile Identity</p>
            <h2 class="font-serif text-xl font-extrabold text-foreground mt-1">Portfolio details</h2>
          </div>

          <div class="space-y-4">
            <label class="block space-y-2">
              <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</span>
              <input
                formControlName="name"
                type="text"
                class="w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <label class="block space-y-2">
              <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug</span>
              <input
                formControlName="slug"
                type="text"
                class="w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
            </label>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              [disabled]="editForm.invalid || saving()"
              class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving() ? 'Saving...' : 'Save Changes' }}
            </button>

            <button
              type="button"
              (click)="toggleStatus()"
              [disabled]="saving() || !portfolio()"
              class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border text-sm font-bold text-foreground hover:bg-secondary/40 disabled:opacity-50"
            >
              {{ portfolio()?.isActive ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </form>

        <aside class="space-y-4">
          <div class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-sm">
            <div class="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Last Updated</p>
            <p class="text-sm font-bold text-foreground mt-2">{{ portfolio()?.updatedAt ? (portfolio()?.updatedAt | date:'medium') : 'Unknown' }}</p>
          </div>

          <div class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-sm">
            <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Next Step</p>
            <h3 class="font-serif text-lg font-extrabold text-foreground mt-2">Content editor</h3>
            <p class="text-sm text-muted-foreground mt-1">Hero, skills, projects, SEO, and theme controls arrive in Phase 4.</p>
          </div>

          <button
            type="button"
            (click)="deletePortfolio()"
            [disabled]="saving() || !portfolio()"
            class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-destructive/20 text-sm font-bold text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            Delete Portfolio
          </button>
        </aside>
      </section>
    </div>
  `,
})
export class PortfolioEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminApi = inject(AdminApiService);

  portfolio = signal<Portfolio | null>(null);
  loading = signal(true);
  saving = signal(false);
  error = signal('');
  notice = signal('');

  editForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    slug: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(/^[a-z0-9-]+$/)]],
  });

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio(): void {
    const routeId = this.route.snapshot.paramMap.get('id') || '';
    const slug = this.route.snapshot.queryParamMap.get('slug') || routeId;

    this.loading.set(true);
    this.error.set('');

    this.adminApi.getPortfolio(slug)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => {
          this.portfolio.set(response.data);
          this.editForm.patchValue({
            name: response.data.name,
            slug: response.data.slug,
          });
        },
        error: () => this.error.set('Could not load this portfolio. The current backend detail endpoint expects a slug.'),
      });
  }

  savePortfolio(): void {
    const portfolio = this.portfolio();

    if (!portfolio || this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.notice.set('');

    this.adminApi.updatePortfolio(this.portfolioId(portfolio), this.editForm.getRawValue())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: response => {
          this.portfolio.set(response.data);
          this.notice.set('Portfolio updated successfully.');
        },
        error: () => this.error.set('Could not save changes. The backend may not have the update endpoint yet.'),
      });
  }

  toggleStatus(): void {
    const portfolio = this.portfolio();

    if (!portfolio) {
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.notice.set('');

    this.adminApi.togglePortfolioStatus(this.portfolioId(portfolio), !portfolio.isActive)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: response => {
          this.portfolio.set(response.data);
          this.notice.set(`Portfolio ${response.data.isActive ? 'activated' : 'deactivated'} successfully.`);
        },
        error: () => this.error.set('Could not update status. The backend may not have the status endpoint yet.'),
      });
  }

  deletePortfolio(): void {
    const portfolio = this.portfolio();

    if (!portfolio || !window.confirm(`Delete "${portfolio.name}"? This cannot be undone.`)) {
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.notice.set('');

    this.adminApi.deletePortfolio(this.portfolioId(portfolio))
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/admin/portfolios']),
        error: () => this.error.set('Could not delete portfolio. The backend may not have the delete endpoint yet.'),
      });
  }

  private portfolioId(portfolio: Portfolio): string {
    return portfolio._id || portfolio.id || portfolio.slug;
  }
}

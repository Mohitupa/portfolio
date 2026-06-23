import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Portfolio } from '../../../../models/admin.model';
import { AdminApiService } from '../../../../services/admin-api.service';

@Component({
  selector: 'app-admin-portfolios-list',
  standalone: true,
  imports: [DatePipe, NgClass, NgFor, NgIf, ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-widest font-bold text-primary mb-2">Portfolio CMS</p>
          <h1 class="font-serif text-3xl font-extrabold text-foreground tracking-tight">Portfolios</h1>
          <p class="text-sm text-muted-foreground mt-1 font-medium">Create, edit, activate, and retire portfolio instances.</p>
        </div>

        <button
          type="button"
          (click)="openCreatePanel()"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>New Portfolio</span>
        </button>
      </div>

      <div *ngIf="notice()" class="rounded-2xl border border-primary/20 bg-primary/10 text-primary px-4 py-3 text-sm font-semibold">
        {{ notice() }}
      </div>

      <div *ngIf="error()" class="rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive px-4 py-3 text-sm font-semibold">
        {{ error() }}
      </div>

      <section
        *ngIf="showCreatePanel()"
        class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-sm"
      >
        <div class="flex items-start justify-between gap-4 border-b border-border/80 pb-4 mb-5">
          <div>
            <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Create Instance</p>
            <h2 class="font-serif text-xl font-extrabold text-foreground mt-1">New portfolio shell</h2>
          </div>
          <button
            type="button"
            (click)="closeCreatePanel()"
            class="w-9 h-9 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors flex items-center justify-center"
            aria-label="Close create portfolio form"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form [formGroup]="createForm" (ngSubmit)="createPortfolio()" class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <label class="space-y-2">
            <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</span>
            <input
              formControlName="name"
              type="text"
              class="w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              placeholder="Mohit Portfolio"
            />
          </label>

          <label class="space-y-2">
            <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug</span>
            <input
              formControlName="slug"
              type="text"
              class="w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              placeholder="mohit"
            />
          </label>

          <button
            type="submit"
            [disabled]="createForm.invalid || saving()"
            class="h-12 px-5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving() ? 'Creating...' : 'Create' }}
          </button>
        </form>
      </section>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <article class="bg-card/40 backdrop-blur-md border border-border/80 rounded-2xl p-5 shadow-sm">
          <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Total</p>
          <h3 class="font-serif text-3xl font-extrabold text-foreground mt-2">{{ portfolios().length }}</h3>
        </article>
        <article class="bg-card/40 backdrop-blur-md border border-border/80 rounded-2xl p-5 shadow-sm">
          <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Active</p>
          <h3 class="font-serif text-3xl font-extrabold text-primary mt-2">{{ activeCount() }}</h3>
        </article>
        <article class="bg-card/40 backdrop-blur-md border border-border/80 rounded-2xl p-5 shadow-sm">
          <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Inactive</p>
          <h3 class="font-serif text-3xl font-extrabold text-muted-foreground mt-2">{{ inactiveCount() }}</h3>
        </article>
      </div>

      <section class="bg-card/40 backdrop-blur-md border border-border/80 rounded-3xl shadow-sm overflow-hidden">
        <div class="p-5 border-b border-border/80 flex items-center justify-between gap-4">
          <div>
            <h2 class="font-serif text-xl font-extrabold text-foreground tracking-tight">Portfolio registry</h2>
            <p class="text-xs text-muted-foreground mt-1 font-medium">Each card maps to a public portfolio profile.</p>
          </div>
          <button
            type="button"
            (click)="loadPortfolios()"
            [disabled]="loading()"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/40 disabled:opacity-50"
          >
            <svg class="w-4 h-4" [class.animate-spin]="loading()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992m0 0V4.356m0 4.992-3.181-3.183a8.25 8.25 0 0 0-13.803 3.7M7.977 14.652H2.985m0 0v4.992m0-4.992 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        <div *ngIf="loading() && portfolios().length === 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5">
          <div *ngFor="let item of [1, 2, 3, 4]" class="h-40 rounded-2xl bg-muted/40 animate-pulse"></div>
        </div>

        <div *ngIf="!loading() && portfolios().length === 0" class="p-12 text-center">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387" />
            </svg>
          </div>
          <h3 class="font-serif text-xl font-extrabold text-foreground">No portfolios yet</h3>
          <p class="text-sm text-muted-foreground mt-1">Create the first shell, then move into the CMS editor in Phase 4.</p>
        </div>

        <div *ngIf="portfolios().length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5">
          <article
            *ngFor="let portfolio of portfolios(); trackBy: trackPortfolio"
            class="rounded-3xl border border-border/80 bg-background/40 p-5 hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-3">
                  <span class="h-2.5 w-2.5 rounded-full" [ngClass]="portfolio.isActive ? 'bg-primary shadow-sm shadow-primary/40' : 'bg-muted-foreground/40'"></span>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border" [ngClass]="portfolio.isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/50 text-muted-foreground border-border'">
                    {{ portfolio.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <h3 class="font-serif text-xl font-extrabold text-foreground truncate">{{ portfolio.name }}</h3>
                <p class="text-xs font-semibold text-muted-foreground mt-1">/{{ portfolio.slug }}</p>
              </div>

              <span class="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </span>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div class="rounded-2xl border border-border/70 bg-card/40 p-3">
                <p class="font-bold uppercase tracking-wider text-muted-foreground">Created</p>
                <p class="font-semibold text-foreground mt-1">{{ portfolio.createdAt ? (portfolio.createdAt | date:'mediumDate') : 'Unknown' }}</p>
              </div>
              <div class="rounded-2xl border border-border/70 bg-card/40 p-3">
                <p class="font-bold uppercase tracking-wider text-muted-foreground">Updated</p>
                <p class="font-semibold text-foreground mt-1">{{ portfolio.updatedAt ? (portfolio.updatedAt | date:'mediumDate') : 'Unknown' }}</p>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <a
                [routerLink]="['/admin/portfolios', portfolioId(portfolio), 'edit']"
                [queryParams]="{ slug: portfolio.slug }"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                </svg>
                <span>Edit</span>
              </a>

              <button
                type="button"
                (click)="toggleStatus(portfolio)"
                [disabled]="actionId() === portfolioId(portfolio)"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-bold text-foreground hover:bg-secondary/40 disabled:opacity-50"
              >
                {{ portfolio.isActive ? 'Deactivate' : 'Activate' }}
              </button>

              <button
                type="button"
                (click)="deletePortfolio(portfolio)"
                [disabled]="actionId() === portfolioId(portfolio)"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-destructive/20 text-xs font-bold text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  `,
})
export class PortfoliosListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminApi = inject(AdminApiService);

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
        error: () => this.error.set('Could not load portfolios. Please confirm the API is running and your session is valid.'),
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
          this.notice.set('Portfolio created successfully.');
          this.closeCreatePanel();
        },
        error: error => this.error.set(error?.error?.message || 'Could not create portfolio. Check the slug and try again.'),
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
          this.notice.set(`Portfolio ${response.data.isActive ? 'activated' : 'deactivated'} successfully.`);
        },
        error: () => this.error.set('Could not update status. The backend may not have the status endpoint yet.'),
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
          this.notice.set('Portfolio deleted successfully.');
        },
        error: () => this.error.set('Could not delete portfolio. The backend may not have the delete endpoint yet.'),
      });
  }

  portfolioId(portfolio: Portfolio): string {
    return portfolio._id || portfolio.id || portfolio.slug;
  }

  trackPortfolio = (_: number, portfolio: Portfolio): string => this.portfolioId(portfolio);
}

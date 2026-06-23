import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ContactMessage } from '../../../../models/admin.model';
import { AdminApiService } from '../../../../services/admin-api.service';

@Component({
  selector: 'app-admin-contact-message-detail',
  standalone: true,
  imports: [DatePipe, NgClass, NgIf, RouterLink],
  template: `
    <div class="p-6 space-y-6 max-w-5xl mx-auto">
      <a routerLink="/admin/contact-messages" class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        <span>Back to inbox</span>
      </a>

      <div *ngIf="notice()" class="rounded-2xl border border-primary/20 bg-primary/10 text-primary px-4 py-3 text-sm font-semibold">
        {{ notice() }}
      </div>

      <div *ngIf="error()" class="rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive px-4 py-3 text-sm font-semibold">
        {{ error() }}
      </div>

      <div *ngIf="loading()" class="h-96 rounded-3xl bg-muted/40 animate-pulse"></div>

      <section *ngIf="!loading() && message()" class="grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-6">
        <article class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-6 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border/80 pb-6 mb-6">
            <div class="flex items-start gap-4 min-w-0">
              <div class="relative w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">
                {{ message()!.name.charAt(0).toUpperCase() }}
                <span *ngIf="!message()!.isRead" class="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-primary border-2 border-card"></span>
              </div>
              <div class="min-w-0">
                <p class="text-xs uppercase tracking-widest font-bold text-primary mb-2">Contact Message</p>
                <h1 class="font-serif text-3xl font-extrabold text-foreground tracking-tight break-words">{{ message()!.subject }}</h1>
                <p class="text-sm text-muted-foreground mt-2 font-semibold">
                  From {{ message()!.name }} · {{ message()!.createdAt | date:'medium' }}
                </p>
              </div>
            </div>

            <span
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border self-start"
              [ngClass]="message()!.isRead ? 'bg-secondary/60 text-muted-foreground border-border' : 'bg-primary/10 text-primary border-primary/20'"
            >
              <span class="h-2 w-2 rounded-full" [ngClass]="message()!.isRead ? 'bg-muted-foreground/40' : 'bg-primary shadow-sm shadow-primary/40'"></span>
              {{ message()!.isRead ? 'Read' : 'Unread' }}
            </span>
          </div>

          <div class="prose-message whitespace-pre-wrap text-base leading-relaxed text-foreground">
            {{ message()!.message }}
          </div>
        </article>

        <aside class="space-y-4">
          <div class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-sm">
            <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Sender</p>
            <h2 class="font-serif text-xl font-extrabold text-foreground mt-3">{{ message()!.name }}</h2>
            <a [href]="'mailto:' + message()!.email" class="text-sm font-semibold text-primary hover:underline break-all mt-2 inline-block">
              {{ message()!.email }}
            </a>
          </div>

          <div class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-sm space-y-3">
            <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Actions</p>

            <a
              [href]="replyMailto()"
              class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm"
            >
              Reply by email
            </a>

            <button
              type="button"
              (click)="markRead()"
              [disabled]="message()!.isRead || actionLoading()"
              class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border text-sm font-bold text-foreground hover:bg-secondary/40 disabled:opacity-50"
            >
              Mark as read
            </button>

            <button
              type="button"
              (click)="deleteMessage()"
              [disabled]="actionLoading()"
              class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-destructive/20 text-sm font-bold text-destructive hover:bg-destructive/10 disabled:opacity-50"
            >
              Delete message
            </button>
          </div>

          <div class="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-sm">
            <p class="text-xs uppercase tracking-widest font-bold text-muted-foreground">Timeline</p>
            <div class="mt-4 space-y-3 text-sm">
              <div>
                <p class="font-bold text-foreground">Received</p>
                <p class="text-muted-foreground text-xs font-semibold mt-1">{{ message()!.createdAt | date:'medium' }}</p>
              </div>
              <div>
                <p class="font-bold text-foreground">Last Updated</p>
                <p class="text-muted-foreground text-xs font-semibold mt-1">{{ message()!.updatedAt | date:'medium' }}</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  `,
  styles: [`
    .prose-message {
      font-family: var(--app-font-sans);
    }
  `],
})
export class ContactMessageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminApi = inject(AdminApiService);

  message = signal<ContactMessage | null>(null);
  loading = signal(true);
  actionLoading = signal(false);
  error = signal('');
  notice = signal('');

  ngOnInit(): void {
    this.loadMessage();
  }

  loadMessage(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';

    this.loading.set(true);
    this.error.set('');

    this.adminApi.getContactMessage(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => this.message.set(response.data),
        error: error => this.error.set(error?.error?.message || 'Could not load this message.'),
      });
  }

  markRead(): void {
    const message = this.message();

    if (!message || message.isRead) {
      return;
    }

    this.actionLoading.set(true);
    this.error.set('');
    this.notice.set('');

    this.adminApi.markContactMessageRead(message._id)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: response => {
          this.message.set(response.data);
          this.notice.set('Message marked as read.');
        },
        error: error => this.error.set(error?.error?.message || 'Could not mark this message as read.'),
      });
  }

  deleteMessage(): void {
    const message = this.message();

    if (!message || !window.confirm(`Delete message from "${message.name}"? This cannot be undone.`)) {
      return;
    }

    this.actionLoading.set(true);
    this.error.set('');
    this.notice.set('');

    this.adminApi.deleteContactMessage(message._id)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/admin/contact-messages']),
        error: error => this.error.set(error?.error?.message || 'Could not delete this message.'),
      });
  }

  replyMailto(): string {
    const message = this.message();

    if (!message) {
      return '';
    }

    const subject = encodeURIComponent(`Re: ${message.subject}`);
    const body = encodeURIComponent(`Hi ${message.name},\n\n`);

    return `mailto:${message.email}?subject=${subject}&body=${body}`;
  }
}

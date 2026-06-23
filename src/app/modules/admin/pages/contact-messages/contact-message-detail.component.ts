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
  templateUrl: './contact-message-detail.component.html',
  styleUrl: './contact-message-detail.component.css',
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

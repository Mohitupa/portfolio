import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ContactMessage } from '../../../../models/admin.model';
import { AdminApiService } from '../../../../services/admin-api.service';
import { ToastService } from '../../../../services/toast.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-admin-contact-message-detail',
  standalone: true,
  imports: [DatePipe, NgClass, NgIf, RouterLink, HasPermissionDirective],
  templateUrl: './contact-message-detail.component.html',
  styleUrl: './contact-message-detail.component.css',
})
export class ContactMessageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminApi = inject(AdminApiService);
  private toast = inject(ToastService);

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
        error: error => {
          const message = error?.error?.message || 'Could not load this message.';
          this.error.set(message);
          this.toast.error(message);
        },
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
          this.toast.success('Message marked as read.');
        },
        error: error => this.toast.error(error?.error?.message || 'Could not mark this message as read.'),
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
        next: () => {
          this.toast.success('Message deleted successfully.');
          this.router.navigate(['/admin/contact-messages']);
        },
        error: error => this.toast.error(error?.error?.message || 'Could not delete this message.'),
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

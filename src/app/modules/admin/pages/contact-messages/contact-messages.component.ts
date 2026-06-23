import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ContactMessage } from '../../../../models/admin.model';
import { AdminApiService } from '../../../../services/admin-api.service';
import { ToastService } from '../../../../services/toast.service';

type MessageFilter = 'all' | 'unread' | 'read';

@Component({
  selector: 'app-admin-contact-messages',
  standalone: true,
  imports: [DatePipe, FormsModule, NgClass, NgFor, NgIf, RouterLink],
  templateUrl: './contact-messages.component.html',
  styleUrl: './contact-messages.component.css',
})
export class ContactMessagesComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private toast = inject(ToastService);

  filters: { key: MessageFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'read', label: 'Read' },
  ];

  messages = signal<ContactMessage[]>([]);
  loading = signal(false);
  error = signal('');
  notice = signal('');
  actionId = signal('');
  filter = signal<MessageFilter>('all');
  searchTerm = '';

  unreadCount = computed(() => this.messages().filter(message => !message.isRead).length);
  readCount = computed(() => this.messages().filter(message => message.isRead).length);

  filteredMessages(): ContactMessage[] {
    const query = this.searchTerm.trim().toLowerCase();

    return this.messages().filter(message => {
      const matchesFilter =
        this.filter() === 'all' ||
        (this.filter() === 'unread' && !message.isRead) ||
        (this.filter() === 'read' && message.isRead);

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        message.name,
        message.email,
        message.subject,
        message.message,
      ].some(value => value.toLowerCase().includes(query));
    });
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading.set(true);
    this.error.set('');

    this.adminApi.getContactMessages()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => this.messages.set(response.data ?? []),
        error: error => {
          const message = error?.error?.message || 'Could not load contact messages.';
          this.error.set(message);
          this.toast.error(message);
        },
      });
  }

  markRead(message: ContactMessage): void {
    if (message.isRead) {
      return;
    }

    this.actionId.set(message._id);
    this.error.set('');
    this.notice.set('');

    this.adminApi.markContactMessageRead(message._id)
      .pipe(finalize(() => this.actionId.set('')))
      .subscribe({
        next: response => {
          this.messages.update(messages => messages.map(item => item._id === message._id ? response.data : item));
          this.toast.success('Message marked as read.');
        },
        error: error => this.toast.error(error?.error?.message || 'Could not mark this message as read.'),
      });
  }

  deleteMessage(message: ContactMessage): void {
    if (!window.confirm(`Delete message from "${message.name}"? This cannot be undone.`)) {
      return;
    }

    this.actionId.set(message._id);
    this.error.set('');
    this.notice.set('');

    this.adminApi.deleteContactMessage(message._id)
      .pipe(finalize(() => this.actionId.set('')))
      .subscribe({
        next: () => {
          this.messages.update(messages => messages.filter(item => item._id !== message._id));
          this.toast.success('Message deleted successfully.');
        },
        error: error => this.toast.error(error?.error?.message || 'Could not delete this message.'),
      });
  }

  trackMessage = (_: number, message: ContactMessage): string => message._id;
}

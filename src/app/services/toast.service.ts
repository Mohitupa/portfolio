import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private nextId = 1;
  toasts = signal<ToastMessage[]>([]);

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: number): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  private show(type: ToastType, message: string): void {
    const id = this.nextId++;

    this.toasts.update(toasts => [...toasts, { id, type, message }]);
    window.setTimeout(() => this.dismiss(id), 4200);
  }
}

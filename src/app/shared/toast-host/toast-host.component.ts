import { NgClass, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastMessage, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [NgClass, NgFor],
  templateUrl: './toast-host.component.html',
  styleUrl: './toast-host.component.css'
})
export class ToastHostComponent {
  toast = inject(ToastService);

  trackToast = (_: number, item: ToastMessage): number => item.id;
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      link: '/admin/dashboard',
      icon: ''
    },
    {
      label: 'Portfolios',
      link: '/admin/portfolios',
      icon: ''
    },
    {
      label: 'Media',
      link: '/admin/media',
      icon: ''
    },
    {
      label: 'Messages',
      link: '/admin/contact-messages',
      icon: ''
    },
    {
      label: 'Admin Users',
      link: '/admin/admin-users',
      icon: ''
    },
    {
      label: 'Settings',
      link: '/admin/settings',
      icon: ''
    }
  ];

  unreadMessagesCount = signal<number>(5); // Mock unread count for Phase 1

  constructor(public auth: AuthService) {}

  onLogout(): void {
    this.auth.logout();
  }
}

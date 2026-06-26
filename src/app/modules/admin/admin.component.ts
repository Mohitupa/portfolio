import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminApiService } from '../../services/admin-api.service';

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
export class AdminComponent implements OnInit {
  navItems = computed<NavItem[]>(() => {
    return this.allNavItems.filter(item => {
      const perm = this.navPermissionMap[item.label];
      return perm ? this.auth.hasPermission(perm) : true;
    });
  });

  private allNavItems: NavItem[] = [
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

  private navPermissionMap: Record<string, string> = {
    'Dashboard': 'dashboard.read',
    'Portfolios': 'portfolio.read',
    'Media': 'media.read',
    'Messages': 'contact.read',
    'Admin Users': 'admin.read',
    'Settings': 'settings.read'
  };

  unreadMessagesCount = signal<number>(0);

  constructor(
    public auth: AuthService,
    private adminApi: AdminApiService
  ) {}

  ngOnInit(): void {
    this.loadUnreadMessagesCount();
  }

  loadUnreadMessagesCount(): void {
    this.adminApi.getContactMessages().subscribe({
      next: response => {
        const unreadCount = (response.data || []).filter(message => !message.isRead).length;
        this.unreadMessagesCount.set(unreadCount);
      },
      error: () => this.unreadMessagesCount.set(0),
    });
  }

  onLogout(): void {
    this.auth.logout();
  }
}

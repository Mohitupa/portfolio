import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'portfolios',
        loadComponent: () => import('./pages/portfolios/portfolios-list.component').then(m => m.PortfoliosListComponent)
      },
      {
        path: 'portfolios/:id/edit',
        loadComponent: () => import('./pages/portfolios/portfolio-edit.component').then(m => m.PortfolioEditComponent)
      },
      {
        path: 'media',
        loadComponent: () => import('./pages/media/media.component').then(m => m.MediaComponent)
      },
      {
        path: 'contact-messages',
        loadComponent: () => import('./pages/contact-messages/contact-messages.component').then(m => m.ContactMessagesComponent)
      },
      {
        path: 'contact-messages/:id',
        loadComponent: () => import('./pages/contact-messages/contact-message-detail.component').then(m => m.ContactMessageDetailComponent)
      },
      {
        path: 'admin-users',
        loadComponent: () => import('./pages/admin-users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

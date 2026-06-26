import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { permissionGuard } from '../../core/guards/permission.guard';

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
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['dashboard.read']
        }
      },
      {
        path: 'portfolios',
        loadComponent: () => import('./pages/portfolios/portfolios-list.component').then(m => m.PortfoliosListComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['portfolio.read']
        }
      },
      {
        path: 'portfolios/:id/edit',
        loadComponent: () => import('./pages/portfolios/portfolio-edit.component').then(m => m.PortfolioEditComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['portfolio.read']
        }
      },
      {
        path: 'media',
        loadComponent: () => import('./pages/media/media.component').then(m => m.MediaComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['media.read']
        }
      },
      {
        path: 'contact-messages',
        loadComponent: () => import('./pages/contact-messages/contact-messages.component').then(m => m.ContactMessagesComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['contact.read']
        }
      },
      {
        path: 'contact-messages/:id',
        loadComponent: () => import('./pages/contact-messages/contact-message-detail.component').then(m => m.ContactMessageDetailComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['contact.read']
        }
      },
      {
        path: 'admin-users',
        loadComponent: () => import('./pages/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['admin.read']
        }
      },
      {
        path: 'roles',
        loadComponent: () => import('./pages/roles/roles.component').then(m => m.RolesComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['role.read']
        }
      },
      {
        path: 'permissions',
        loadComponent: () => import('./pages/permissions/permissions.component').then(m => m.PermissionsComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['permission.read']
        }
      },
      {
        path: 'roles/:roleId/permissions',
        loadComponent: () => import('./pages/role-permissions/role-permissions.component').then(m => m.RolePermissionsComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['role-permission.read']
        }
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [permissionGuard],
        data: {
          permissions: ['settings.read']
        }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

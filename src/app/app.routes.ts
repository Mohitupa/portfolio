import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./modules/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: ':slug',
    loadComponent: () => import('./modules/portfolio/portfolio.component').then(m => m.PortfolioComponent)
  },
  {
    path: '',
    redirectTo: 'fstack',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'fstack'
  }
];


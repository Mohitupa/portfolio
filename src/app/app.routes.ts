import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES)
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

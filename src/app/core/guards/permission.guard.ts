import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredPermissions: string[] =
    (route.data && route.data['permissions']) || [];

  // If no permissions are required, allow access.
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  const allowed = authService.hasAllPermissions(requiredPermissions);

  if (allowed) {
    return true;
  }

  // Redirect to default dashboard (existing route)
  router.navigate(['/admin/dashboard']);
  return false;
};

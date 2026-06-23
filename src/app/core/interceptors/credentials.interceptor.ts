import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn =
(req, next) => {

  const requiresCredentials =
    req.url.includes('/auth/') ||
    req.url.includes('/dashboard/') ||
    req.url.includes('/admin-users/') ||
    req.url.includes('/media/') ||
    req.url.includes('/contact-messages/');

  if (!requiresCredentials) {
    return next(req);
  }

  return next(
    req.clone({
      withCredentials: true
    })
  );
};
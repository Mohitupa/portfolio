import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  let authReq = req;
  if (token && !req.url.includes('/api/auth/login')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return authService
          .refreshToken()
          .pipe(
            switchMap(
              (response) => {

                authService
                  .setAccessToken(
                    response.data.accessToken
                  );

                const retryReq =
                  req.clone({
                    setHeaders: {
                      Authorization:
                        `Bearer ${response.data.accessToken}`
                    }
                  });

                return next(retryReq);
              }
            ),

            catchError(() => {

              authService.logout();

              return throwError(
                () => error
              );
            })
          );
      }
      return throwError(() => error);
    })
  );
};

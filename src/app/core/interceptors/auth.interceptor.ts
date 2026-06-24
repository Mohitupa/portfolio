import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

let isRefreshing = false;

const refreshTokenSubject =
  new BehaviorSubject<string | null>(
    null
  );
  
export const authInterceptor:
HttpInterceptorFn =
(req, next) => {

  const authService =
    inject(AuthService);

  const token =
    authService.getAccessToken();

  let authReq = req;

  if (
    token &&
    !req.url.includes(
      '/auth/login'
    )
  ) {
    authReq = req.clone({
      setHeaders: {
        Authorization:
          `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(

    catchError(
      (
        error:
        HttpErrorResponse
      ) => {

        const isAuthEndpoint =
          req.url.includes(
            '/auth/login'
          ) ||
          req.url.includes(
            '/auth/logout'
          ) ||
          req.url.includes(
            '/auth/refresh-token'
          );

        if (
          error.status !== 401 ||
          isAuthEndpoint
        ) {
          return throwError(
            () => error
          );
        }

        if (!isRefreshing) {

          isRefreshing = true;

          refreshTokenSubject.next(
            null
          );

          return authService
            .refreshToken()
            .pipe(

              switchMap(
                (response) => {

                  const newToken =
                    response.data
                      .accessToken;

                  authService
                    .setAccessToken(
                      newToken
                    );

                  isRefreshing =
                    false;

                  refreshTokenSubject.next(
                    newToken
                  );

                  return next(
                    req.clone({
                      setHeaders: {
                        Authorization:
                          `Bearer ${newToken}`
                      }
                    })
                  );
                }
              ),

              catchError(
                (
                  refreshError
                ) => {

                  isRefreshing =
                    false;

                  authService
                    .logout();

                  return throwError(
                    () =>
                      refreshError
                  );
                }
              )
            );
        }

        return refreshTokenSubject.pipe(

          filter(
            token => !!token
          ),

          take(1),

          switchMap(
            token => {

              return next(
                req.clone({
                  setHeaders: {
                    Authorization:
                      `Bearer ${token}`
                  }
                })
              );
            }
          )
        );
      }
    )
  );
};
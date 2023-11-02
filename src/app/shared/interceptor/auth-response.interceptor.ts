import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthResponseInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          if(this.auth.rToken === ""){
            return next.handle(req)
          }
          this.auth.removeAccessToken()
          return this.auth.refreshToken().pipe(
            switchMap(() => {
              const newRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.auth.token}`,
                },
              });
              return next.handle(newRequest);
            }),
            catchError((refreshError: any) => {
              if (refreshError.status === 401) {
                this.loginError()
              }
              return throwError(()=>refreshError);
            })
          );
        }
        return next.handle(req);
      })
    );
  }

  private loginError() {
    this.auth.loginError()
    setTimeout(() => this.router.navigate(["/login"]), 1500)
  }
}

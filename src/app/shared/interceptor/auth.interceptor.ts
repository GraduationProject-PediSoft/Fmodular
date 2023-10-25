import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,  
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.token
    if (token == "") {
      //Return inmedialy to avoid 401 errors with oauth2 resource servers
      return next.handle(req)
    }
    req = req.clone({
      setHeaders: {
        Authorization: "Bearer " + token
      }
    })
    return next.handle(req)
  }
}

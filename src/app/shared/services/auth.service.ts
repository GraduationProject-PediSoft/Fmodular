import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { OIDCEntity } from '../entity/oidc';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly INTERNAL_STORAGE_NAME = "currentOIDC"
  private authenticationResponseSubject: BehaviorSubject<OIDCEntity>
  public isLoggedIn: boolean = false;

  public get isLogged() {
    return this.authenticationResponseSubject;
  }

  public get token(): string {
    return this.authenticationResponseSubject.value.access_token;
  }

  constructor(private http: HttpClient) {
    let oidc = localStorage.getItem('currentOIDC');
    if (oidc === null) {
      this.authenticationResponseSubject = new BehaviorSubject<OIDCEntity>(new OIDCEntity);
    } else {
      this.isLoggedIn = true
      this.authenticationResponseSubject = new BehaviorSubject<OIDCEntity>(JSON.parse(oidc));
    }
  }

  login(credentials:{username: string, password: string}): Observable<OIDCEntity> {
    return this.http.post<OIDCEntity>(`${environment.backendApi}/user/auth/login`, {
      "username": credentials.username,
      "password": credentials.password
    })
      .pipe(map((oidc: OIDCEntity) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem(AuthService.INTERNAL_STORAGE_NAME, JSON.stringify(oidc));
        this.authenticationResponseSubject.next(oidc);
        this.isLoggedIn = true;
        return oidc;
      })
    );
  }

  logout() {
    const refreshToken = this.authenticationResponseSubject.value.refresh_token;

    return this.http.post(`${environment.backendApi}/user/auth/logout`, { refreshToken: refreshToken }).pipe(
      map(v => {
        this.removeToken();
        this.authenticationResponseSubject.next(new OIDCEntity);
        this.isLoggedIn = false;
      })
    );
  }

  private removeToken(){
    localStorage.removeItem(AuthService.INTERNAL_STORAGE_NAME)
  }

  loginError(){
    this.authenticationResponseSubject.next(new OIDCEntity)
    this.isLoggedIn = false
    this.removeToken()
  }

}

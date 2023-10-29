import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { OIDCEntity } from '../entity/oidc';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RefreshTokenResponse } from '../entity/refresh-token-response';

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

  logout(): Observable<any> {
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

  refreshToken(): Observable<any> {
    const refresh = {refreshToken: this.isLogged.value.refresh_token}
    return this.http.post<any>(`${environment.backendApi}/user/auth/refresh`, refresh)
      .pipe(
        map((ref: RefreshTokenResponse)=>{
          const oidc = new OIDCEntity
          oidc.access_token = ref.access_token
          oidc.expires_in = ref.expires_in
          oidc.id_token = this.isLogged.value.id_token
          oidc.not_before_policy = ref.not_before_policy
          oidc.refresh_expires_in = ref.refresh_expires_in
          oidc.refresh_token = this.isLogged.value.refresh_token
          oidc.scope = ref.scope
          oidc.session_state = this.isLogged.value.session_state
          oidc.token_type = ref.token_type
          this.authenticationResponseSubject.next(oidc)
        })
      )
  }

  loginError(){
    this.authenticationResponseSubject.next(new OIDCEntity)
    this.isLoggedIn = false
    this.removeToken()
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize, map } from 'rxjs';
import { OIDCEntity } from '../entity/oidc';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RefreshTokenResponse } from '../entity/refresh-token-response';

/**
 * Authentication service for the app
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static readonly INTERNAL_STORAGE_NAME = "currentOIDC"
  private authenticationResponseSubject: BehaviorSubject<OIDCEntity>
  public isLoggedIn: boolean = false;

  /**
   * @get Return rxjs subject with the oidc en entity
   */
  public get isLogged() {
    return this.authenticationResponseSubject;
  }

  /**
   * @get Get access token
   */
  public get token(): string {
    return this.authenticationResponseSubject.value.access_token;
  }

  /**
   * @get Get refresh token
   */
  public get rToken(): string{
    return this.authenticationResponseSubject.value.refresh_token;
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

  /**
   * Login with the diven credentials
   * @param credentials credentials for the user
   * @returns Observable with the Request result
   */
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

  /**
   * Logouts from the system and deletes internal token
   * @returns Observable with the Request result
   * @remarks
   * The JWT token by design will be valid still after the logout, it is by design of the JWT
   */
  logout(): Observable<any> {
    const refreshToken = this.authenticationResponseSubject.value.refresh_token;

    return this.http.post(`${environment.backendApi}/user/auth/logout`, { refreshToken: refreshToken }).pipe(
      finalize(() => {
        this.removeToken();
        this.authenticationResponseSubject.next(new OIDCEntity);
        this.isLoggedIn = false;
      })
    );
  }

  /**
   * Remove internal entity
   */
  private removeToken(){
    localStorage.removeItem(AuthService.INTERNAL_STORAGE_NAME)
  }

  /**
   * Refresh the access_token fiven the internal refresh_token
   * @returns Observable with the Request result
   */
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

  /**
   * Login error flow
   * deletes internal storage
   */
  loginError(){
    this.authenticationResponseSubject.next(new OIDCEntity)
    this.isLoggedIn = false
    this.removeToken()
  }

  /**
   * Resets access_token when it is expired so a new one can be requested with the refresh_token
   */
  removeAccessToken(){
    const currentData = this.authenticationResponseSubject.value;
    const updatedData = { ...currentData };
    updatedData.access_token = "";
    this.authenticationResponseSubject.next(updatedData);
  }

}

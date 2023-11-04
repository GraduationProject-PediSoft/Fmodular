import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpRequest } from '../entity/signup-request';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { DeleteUserRequest } from '../entity/delete-user-request';

/**
 * Service for manage users in the system
 */
@Injectable({
  providedIn: 'root'
})
export class ManageUserService {

  constructor(private http: HttpClient) {}

  /**
   * Register an user
   * @param signUp user registration info
   * @returns Observable with the result of the request
   */
  signUp(signUp: SignUpRequest): Observable<any> {
    return this.http.post<any>(`${environment.backendApi}/user/`, signUp)
  }

  /**
   * Delete an user by username
   * @param user user info
   * @returns Observable with the result of the request
   */
  deleteUser(user: DeleteUserRequest): Observable<any> {
    return this.http.delete<any>(`${environment.backendApi}/user/`, {body: user})
  }
}

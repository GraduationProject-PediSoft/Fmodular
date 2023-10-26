import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpRequest } from '../entity/signup-request';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DeleteUserRequest } from '../entity/delete-user-request';

@Injectable({
  providedIn: 'root'
})
export class ManageUserService {

  constructor(private http: HttpClient) {}

  signUp(signUp: SignUpRequest): Observable<any> {
    return this.http.post<any>(`${environment.backendApi}/user/`, signUp)
  }

  deleteUser(user: DeleteUserRequest) {
    return this.http.delete<any>(`${environment.backendApi}/user/`, {body: user})
  }
}

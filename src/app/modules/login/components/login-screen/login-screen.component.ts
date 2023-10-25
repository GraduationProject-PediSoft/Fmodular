import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginRequest } from '../../entity/UserLoginRequest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent {
  
  loading = false

  loginForm:FormGroup
  user: UserLoginRequest = new UserLoginRequest

  constructor(private router: Router, 
    private formBuilder: FormBuilder, private auth: AuthService,
    private messageService: MessageService){
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login(){
    this.loginForm.disable
    this.loading = true
    this.user.username = this.loginForm.get("username")?.value
    this.user.password = this.loginForm.get("password")?.value
    this.auth.login({username: this.user.username, password:this.user.password})
      .pipe(finalize(()=>{
        this.loading = false
        this.loginForm.enable
      }))
      .subscribe({
        next:(_) => {
          this.router.navigate(["/home"])
        },
        error: (err: HttpErrorResponse) => {
          if(err.status === 401){
            this.messageService.add({
              severity: 'error',
              summary: 'Error, usuario o contraseña incorrecto',
            })
          }
          else{
            this.messageService.add({
              severity: 'error',
              summary: 'Error con el servidor: ' + err.status,
            })
          }
        }
      })

  }
}

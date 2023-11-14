import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRouterModule } from './login-routing.module';
import { LoginScreenComponent } from './components/login-screen/login-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { PasswordModule } from 'primeng/password'
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

/**
 * A module that defines the Login process of Pedisoft
 */
@NgModule({
  declarations: [
    LoginScreenComponent
  ],
  imports: [
    CommonModule,
    LoginRouterModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ToastModule
  ],
  providers:[
    MessageService
  ]
})
export class LoginModule { }

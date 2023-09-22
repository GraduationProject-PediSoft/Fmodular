import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRouterModule } from './login-routing.module';
import { LoginScreenComponent } from './components/login-screen/login-screen.component';
import { FormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'



@NgModule({
  declarations: [
    LoginScreenComponent
  ],
  imports: [
    CommonModule,
    LoginRouterModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ]
})
export class LoginModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRouterModule } from './login-routing.module';
import { LoginScreenComponent } from './components/login-screen/login-screen.component';



@NgModule({
  declarations: [
    LoginScreenComponent
  ],
  imports: [
    CommonModule,
    LoginRouterModule
  ]
})
export class LoginModule { }

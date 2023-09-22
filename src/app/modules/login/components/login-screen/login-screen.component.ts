import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent {
  a:any

  constructor(private router: Router){}

  login(){
    this.router.navigate(["/home"])
  }
}

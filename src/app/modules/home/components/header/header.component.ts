import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild("navbar_sticky", { static: true })
  mobileNavBar!: ElementRef;

  mobileMenuVisible = false

  constructor(private renderer: Renderer2, private auth: AuthService, private router: Router, private message: MessageService) {
  }


  showMenu() {
    if (this.mobileMenuVisible) {
      this.renderer.removeClass(this.mobileNavBar.nativeElement, "hidden")
    } else {
      this.renderer.addClass(this.mobileNavBar.nativeElement, "hidden")
    }
    this.mobileMenuVisible = !this.mobileMenuVisible
  }

  logout(){
    this.auth.logout().subscribe({
      next: ()=>{
        this.router.navigate(["/login"])
      },
      error:(e: HttpErrorResponse)=>{
        this.message.add({
          severity: "error",
          summary: e.message
        })
      }
    })
  }

}

import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild("navbar_sticky", { static: true })
  mobileNavBar!: ElementRef;

  mobileMenuVisible = false

  constructor(private renderer: Renderer2, protected router: Router) {
  }

  protected checkRoute(route: string) {
    return this.router.isActive(route, 
      { paths: 'subset', queryParams: 'subset', 
      fragment: 'ignored', matrixParams: 'ignored' }
    )
  }


  showMenu() {
    if (this.mobileMenuVisible) {
      this.renderer.removeClass(this.mobileNavBar.nativeElement, "hidden")
    } else {
      this.renderer.addClass(this.mobileNavBar.nativeElement, "hidden")
    }
    this.mobileMenuVisible = !this.mobileMenuVisible
  }

}

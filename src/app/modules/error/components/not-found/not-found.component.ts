import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * A very simple error 404 component
 * @remarks
 * This component uses the primeng ButtonModule for redirection to the home component
 */
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent{
  constructor(private router: Router){}
  backToHome(){
    this.router.navigate(["/login"])
  }
}

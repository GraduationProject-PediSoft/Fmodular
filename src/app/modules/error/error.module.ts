import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ErrorRoutingModule } from './error-routing.module';
import { ButtonModule } from 'primeng/button';


/**
 * This module defines all error components for its use in the project
 */
@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    ButtonModule
  ]
})
export class ErrorModule { }

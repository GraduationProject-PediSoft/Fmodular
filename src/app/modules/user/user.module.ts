import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralUserComponent } from './components/general/general-user.component';
import { CreateUserComponent } from './components/create/create-user.component';
import { DeleteUserComponent } from './components/delete/delete-user.component';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageUserService } from './services/manage-user.service';

/**
 * Module for user administration
 * @exports GeneralUserComponent
 */
@NgModule({
  declarations: [
    GeneralUserComponent,
    CreateUserComponent,
    DeleteUserComponent
  ],
  imports: [
    CommonModule,
    TabViewModule,
    ButtonModule,
    PasswordModule,
    InputTextModule,
    ReactiveFormsModule
  ],
  exports:[
    GeneralUserComponent
  ],
  providers:[
    ManageUserService
  ]
})
export class UserModule { }

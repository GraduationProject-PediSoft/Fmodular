import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: "login", pathMatch: 'full'},
  {path: "login", loadChildren: ()=> import('src/app/modules/login/login.module').then(m => m.LoginModule)},
  {path: "home", loadChildren: ()=> import('src/app/modules/home/home.module').then(m => m.HomeModule)},
  {path: "**", loadChildren: ()=> import('src/app/modules/error/error.module').then(m => m.ErrorModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

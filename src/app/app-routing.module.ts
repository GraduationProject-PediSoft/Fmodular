import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: "login", pathMatch: 'full'},
  {path: "login", loadChildren: ()=> import('src/app/modules/login/login.module').then(m => m.LoginModule)},
  {path: "**", loadChildren: ()=> import('src/app/modules/not-found/not-found.module').then(m => m.NotFoundModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

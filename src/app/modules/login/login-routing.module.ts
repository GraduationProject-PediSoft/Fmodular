import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginScreenComponent } from "./components/login-screen/login-screen.component";

const routes: Routes = [
    {path:"", pathMatch: "full", component: LoginScreenComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRouterModule{}
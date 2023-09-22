import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./components/not-found/not-found.component";

const routes: Routes = [
    //{path: "", redirectTo: "/404", pathMatch: "full"},
    {path:"", pathMatch: "full", component: NotFoundComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ErrorRoutingModule{}
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./components/main/main.component";

const routes: Routes = [
    //{path: "", redirectTo: "/404", pathMatch: "full"},
    {path:"", pathMatch: "full", component: MainComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule{}
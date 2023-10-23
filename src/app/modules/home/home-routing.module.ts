import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlgorithmComponent } from "./components/algorithm/algorithm.component";
import { HomeComponent } from "./home.component";
import { MainComponent } from "./components/main/main.component";
import { UsersComponent } from "./components/users/users.component";
import { HelpComponent } from "./components/help/help.component";

const routes: Routes = [
    {path:"", component: HomeComponent, children:[
        {path:"", component: MainComponent},
        {path:"algorithm", component: AlgorithmComponent, title: "Algoritmos"},
        {path:"users", component: UsersComponent, title: "Usuarios"},
        {path:"help", component: HelpComponent, title: "Ayuda"},
    ]}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule{}
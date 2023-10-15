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
        {path:"algorithm", component: AlgorithmComponent},
        {path:"users", component: UsersComponent},
        {path:"help", component: HelpComponent},
    ]}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule{}
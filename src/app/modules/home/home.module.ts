import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HomeRoutingModule } from './home-routing.module';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }

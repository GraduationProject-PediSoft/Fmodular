import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultViewComponent } from './components/result-view/result-view.component';
import { ResultTagComponent } from './components/result-tag/result-tag.component';



@NgModule({
  declarations: [
    ResultViewComponent,
    ResultTagComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ResultViewComponent
  ]
})
export class ResultModule { }

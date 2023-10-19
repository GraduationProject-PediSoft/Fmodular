import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultViewComponent } from './components/result-view/result-view.component';
import { ResultTagComponent } from './components/result-tag/result-tag.component';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { VisualizerModule } from '../visualizer/visualizer.module';



@NgModule({
  declarations: [
    ResultViewComponent,
    ResultTagComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    CheckboxModule,
    InputNumberModule,
    VisualizerModule
  ],
  exports:[
    ResultViewComponent
  ]
})
export class ResultModule { }

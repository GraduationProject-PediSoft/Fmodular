import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VtkVisualizerComponent } from './components/vtk-visualizer/vtk-visualizer.component';



@NgModule({
  declarations: [
    VtkVisualizerComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    VtkVisualizerComponent
  ]
})
export class VisualizerModule { }

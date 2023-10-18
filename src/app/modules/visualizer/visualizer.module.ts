import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VtkVisualizerComponent } from './components/vtk-visualizer/vtk-visualizer.component';

import { MenubarModule } from 'primeng/menubar';
import { TagsComponent } from './components/tags/tags.component'
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    VtkVisualizerComponent,
    TagsComponent
  ],
  imports: [
    CommonModule,
    MenubarModule,
    TableModule
  ],
  exports:[
    VtkVisualizerComponent
  ],
  providers:[
    DialogService
  ]
})
export class VisualizerModule { }

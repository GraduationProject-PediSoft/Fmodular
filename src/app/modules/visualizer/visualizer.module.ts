import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VtkVisualizerComponent } from './components/vtk-visualizer/vtk-visualizer.component';

import { MenubarModule } from 'primeng/menubar';
import { TagsComponent } from './components/tags/tags.component'
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InfoComponent } from './components/info/info.component';

/**
 * Module for the integration of vtk with angular
 * @exports VtkVisualizerComponent
 */
@NgModule({
  declarations: [
    VtkVisualizerComponent,
    TagsComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    MenubarModule,
    TableModule,
    ButtonModule,
    DialogModule
  ],
  exports:[
    VtkVisualizerComponent
  ],
  providers:[
    DialogService
  ]
})
export class VisualizerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlgorithmFormComponent } from './components/algorithm-form/algorithm-form.component';
import { AlgorithmFormTagComponent } from './components/algorithm-form-tag/algorithm-form-tag.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { VisualizerModule } from '../visualizer/visualizer.module';

/**
 * @module
 * This module defines all the components for building the dynamic form based in the
 * graphql introspection query
 * @exports AlgorithmFormComponent
 */
@NgModule({
  declarations: [
    AlgorithmFormComponent,
    AlgorithmFormTagComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    MessageModule,
    CheckboxModule,
    FileUploadModule,
    VisualizerModule,
    InputTextModule
  ],
  exports:[
    AlgorithmFormComponent
  ]
})
export class FormBuilderModule { }

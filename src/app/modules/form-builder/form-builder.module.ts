import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AlgorithmFormComponent } from './components/algorithm-form/algorithm-form.component';



@NgModule({
  declarations: [
    AlgorithmFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    AlgorithmFormComponent
  ]
})
export class FormBuilderModule { }

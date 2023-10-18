import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BaseTag } from '../../reactive-tags/base-tag';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-algorithm-form-tag',
  templateUrl: './algorithm-form-tag.component.html',
  styleUrls: ['./algorithm-form-tag.component.scss']
})
export class AlgorithmFormTagComponent {
  @Input() tag!: BaseTag<any>;
  @Input() form!: FormGroup;
  get isValid() { return this.form.controls[this.tag.key].valid; }
  get isPristine(){ return this.form.controls[this.tag.key].pristine}
  get value(){return this.form.controls[this.tag.key].value}

  @ViewChild("inputFile")
  inputFile!: ElementRef

  protected openFileSelector(){
    this.inputFile.nativeElement.click()
  }
}

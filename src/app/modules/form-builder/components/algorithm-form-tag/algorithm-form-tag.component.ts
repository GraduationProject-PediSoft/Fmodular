import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BaseTag } from '../../reactive-tags/base-tag';
import { FormGroup } from '@angular/forms';
import { FileSelectEvent, FileUploadEvent, FileUploadHandlerEvent } from 'primeng/fileupload';
import { event } from '@kitware/vtk.js/macros';

@Component({
  selector: 'app-algorithm-form-tag',
  templateUrl: './algorithm-form-tag.component.html',
  styleUrls: ['./algorithm-form-tag.component.scss']
})
export class AlgorithmFormTagComponent {

  @Input() tag!: BaseTag<any>;
  @Input() form!: FormGroup;
  get isValid() { return this.form.controls[this.tag.key].valid; }
  get isPristine() { return this.form.controls[this.tag.key].pristine }
  get value() { return this.form.controls[this.tag.key].value }

  protected readonly ACCEPTED_TYPES_MIME = ["image/jpg", "image/png","image/jpeg"
    ,"application/dicom"]

  protected readonly ACCEPTED_TYPES_EXT = [".dcm", ".jpeg", ".jpg", ".png"]



  protected selectFile($event: FileUploadHandlerEvent, id: any) {
    const file: File = $event.files[0]
    const fileExt: string = "." + file.name.split(".").pop() as string
    if(this.ACCEPTED_TYPES_MIME.includes(file.type) || this.ACCEPTED_TYPES_EXT.includes(fileExt)){
      this.tag.value = file
      this.form.controls[this.tag.key].setValue(file);
    }
    id.clear()
  }
}

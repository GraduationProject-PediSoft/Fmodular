import { Component, Input } from '@angular/core';
import { BaseTag } from '../../reactive-tags/base-tag';
import { FormGroup } from '@angular/forms';
import { FileUploadHandlerEvent } from 'primeng/fileupload';

/**
 * This component defines each html tag representing a graphql type, scalar, custom type etc
 */
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

  protected readonly ACCEPTED_TYPES_EXT = [".dcm"]

  /**
   * If the tag is an image, checks if it is supported in the visualizer component 
   * @param $event Primeng FileUploadHandlerEvent that contains the file
   * @param id id representing the p-fileUpload for clearing it when the file uploads
   */
  protected selectFile($event: FileUploadHandlerEvent, id: any) {
    const file: File = $event.files[0]
    const fileExt: string = "." + file.name.split(".").pop() as string
    if(this.ACCEPTED_TYPES_MIME.includes(file.type)){
      this.tag.value = file
      this.form.controls[this.tag.key].setValue(file);
    }
    else if(this.ACCEPTED_TYPES_EXT.includes(fileExt)){
      //On windows systems dicom MIME Type do not work, so based on the file extention reasign the
      //mime type
      switch(fileExt){
        case '.dcm':{
          this.tag.value = new File([file], file.name, {type: "application/dicom"});
        }
      }
      this.form.controls[this.tag.key].setValue(file);
    }
    id.clear()
  }
}

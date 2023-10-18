import { Injectable } from '@angular/core';
import { BaseTag } from '../reactive-tags/base-tag';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  toFormGroup(tags: BaseTag<any>[]) {
    const group: any = {};

    tags.forEach(tag => {
      group[tag.key] = tag.required ? new FormControl(tag.value || '', Validators.required)
        : new FormControl(tag.value || '');
    });
    return new FormGroup(group);
  }
}

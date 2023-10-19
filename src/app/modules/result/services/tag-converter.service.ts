import { Injectable } from '@angular/core';
import { BaseTag } from '../result-tags/base-tag';

@Injectable({
  providedIn: 'root'
})
export class TagConverterService {

  fromResponseToTag(res: any): BaseTag<any>[]{
    return []
  }
}

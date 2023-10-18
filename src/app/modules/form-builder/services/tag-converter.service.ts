import { Injectable } from '@angular/core';
import { BaseTag } from '../reactive-tags/base-tag';
import { IntTag } from '../reactive-tags/int-tag';
import { StringTag } from '../reactive-tags/string-tag';
import { FloatTag } from '../reactive-tags/float-tag';
import { BoolTag } from '../reactive-tags/bool-tag';
import { ImageTag } from '../reactive-tags/image-tag';

@Injectable({
  providedIn: 'root'
})
export class TagConverterService {

  fromfieldsToTag(fields: any): BaseTag<any>[]{
    const tags: BaseTag<any>[] = []

    //Solo soportado un input de dato
    fields[0].type.ofType.inputFields.forEach(e => {
      tags.push(this.tagFactory(e))
    });

    return tags
  }

  private tagFactory(field: any): BaseTag<any>{
    switch(field.type.ofType.name){
      case "String":{
        return new StringTag({
          key: field.name,
          label: field.description,
          required: true
        })
      }
      case "Int":{
        return new IntTag({
          key: field.name,
          label: field.description,
          required: true
        })
      }
      case "Float":{
        return new FloatTag({
          key: field.name,
          label:field.description,
          required: true
        })
      }
      case "Bool":{
        return new BoolTag({
          key: field.name,
          label:field.description,
          required: true
        })
      }
      case "Upload":{
        return new ImageTag({
          key: field.name,
          label:field.description,
          required: true, 
        })
      }
    }
    return new BaseTag
  }
}

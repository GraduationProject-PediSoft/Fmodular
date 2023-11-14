import { Injectable } from '@angular/core';
import { BaseTag } from '../reactive-tags/base-tag';
import { IntTag } from '../reactive-tags/int-tag';
import { StringTag } from '../reactive-tags/string-tag';
import { FloatTag } from '../reactive-tags/float-tag';
import { BoolTag } from '../reactive-tags/bool-tag';
import { ImageTag } from '../reactive-tags/image-tag';
import { IntrospectionArgsType } from 'src/app/shared/introspection.interface';

/**
 * This service performs the translation from the graphql introspection to the BaseTags that the
 * FormControlService understands
 */
@Injectable({
  providedIn: 'root'
})
export class TagConverterService {

  /**
   * Transforms the graphql instrospection resulto into the reactive tags that are defined in this module
   * @param fields The introspection args of the algorithm as an array
   * @returns An array containing the BaseTags to be rendered in the page
   * @remarks
   * Only supports one type without nested ones
   */
  fromfieldsToTag(fields: IntrospectionArgsType[]): BaseTag<any>[]{
    const tags: BaseTag<any>[] = []

    fields[0].type.ofType?.inputFields.forEach(e => {
      tags.push(this.tagFactory(e))
    });

    return tags
  }

  /**
   * Tag Factory 
   * @param field A graphql field instrospection response that can have an scalar and other custom types 
   * @returns the instantiated BaseTag depending of the name 
   * @remarks
   * The Base class 'BaseTag' is instantiated on an unsupported tag and the html renders a message to show that
   */
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

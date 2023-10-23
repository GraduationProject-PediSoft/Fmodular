import { Injectable } from '@angular/core';
import { BaseTag } from '../result-tags/base-tag';
import { ApolloQueryResult } from '@apollo/client/core';
import { ImageTag } from '../result-tags/image-tag';
import { IntrospectionReturnType } from 'src/app/shared/introspection.interface';
import { BoolTag } from '../result-tags/bool-tag';
import { FloatTag } from '../result-tags/float-tag';
import { IntTag } from '../result-tags/int-tag';
import { StringTag } from '../result-tags/string-tag';
import { JsonTag } from '../result-tags/json-tag';

@Injectable({
  providedIn: 'root'
})
export class TagConverterService {

  // {
  //   "data": {
  //     "marchingSquares": {
  //       "__typename": "PolyData",
  //       "points": "[[[217, 255]"
  //     }
  //   },
  //   "loading": false,
  //   "networkStatus": 7
  // }

  //Queries only return one data type, at version one, not nested types are supported
  fromResponseToTag(res: ApolloQueryResult<any>, algorithm: string, introspectionReturn: IntrospectionReturnType): BaseTag<any>[]{
    console.log(res)
    const tags:BaseTag<any>[] = []
    const data = res.data[algorithm]
    // There are special types we defined, __typename could have them. That types are:
    // URL with an unique field url
    // PolyData with unique field points
    // JSON for a key-value table
    // The first 2 types are specially for the integrated vtk visualizer
    // URL indicates an image resource needs to be downloaded
    // PolyData, A series of line and points to apply to the image
    // The reason behind that is that we could define SCALAR types but not all graphql implementations support it
    // We thought a better and simplier way for the backend was this way
    // If no special type is encountered, the system treat it as a normal tag for primitive scalar types 
    introspectionReturn.ofType?.fields.forEach(e =>{
      tags.push(this.tagFactory(e?.name as string, e?.type.ofType.name as string, data))
    })
    return tags
  }

  private tagFactory(name:string, type: string ,data:any): BaseTag<any>{

    const tagData = {value: data[name], __typename: data.__typename, key: name}
    //Special cases
    switch(data.__typename){
      case "URL" || "PolyData":{
        return new ImageTag(tagData)
      }
      case "JSON":{
          return new JsonTag({value: JSON.parse(data[name]), __typename: data.__typename, key: name})
      }
    }

    //scalar types
    switch(type){
      case "Bool":{
        return new BoolTag(tagData)
      }
      case "Float":{
        return new FloatTag(tagData)
      }
      case "Int":{
        return new IntTag(tagData)
      }
      case "String":{
        return new StringTag(tagData)
      }
    }
    
    return new BaseTag({value: '', __typename: data.__typename, key: ''})
  }
}

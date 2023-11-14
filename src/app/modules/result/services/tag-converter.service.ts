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
import { ImagePolyData } from '../result-tags/image-polydata-tag';
import { ShareDataResultService } from 'src/app/shared/services/share-data-result.service';

/**
 * Service for tranforming tags
 */
@Injectable({
  providedIn: 'root'
})
export class TagConverterService {

  constructor(private sharedData: ShareDataResultService) { }

  /**
   * transforms the graphql response into BaseTags for the response view to render
   * @param res ApolloGraphqlResult
   * @param algorithm name os the algorihtm
   * @param introspectionReturn The schema of the graphql introspection
   * @returns An array of the BaseTags
   * @remarks
   * Queries only return one data type, at version one, not nested types are supported
   * There are special types we defined, __typename could have them. That types are:
   * URL with an unique field url
   * PolyData with unique field points
   * JSON for a key-value table
   * The first 2 types are specially for the integrated vtk visualizer
   * URL indicates an image resource needs to be downloaded
   * PolyData, A series of line and points to apply to the image
   * The reason behind that is that we could define SCALAR types but not all graphql implementations support it
   * We thought a better and simplier way for the backend was this way
   * If no special type is encountered, the system treat it as a normal tag for primitive scalar types 
   */
  fromResponseToTag(res: ApolloQueryResult<any>, algorithm: string, introspectionReturn: IntrospectionReturnType): BaseTag<any>[] {
    const tags: BaseTag<any>[] = []
    const data = res.data[algorithm]
    introspectionReturn.ofType?.fields.forEach(e => {
      tags.push(this.tagFactory(e?.name as string, e?.type.ofType.name as string, data))
    })
    return tags
  }

  /**
   * Tag Factory to tranform from response to BaseTags
   * @param name name of the field
   * @param type type os the field
   * @param data data that corresponds to the field
   * @returns BaseTag to render result
   * @remarks
   * The base class BaseTag is returned if the type is not supported
   */
  private tagFactory(name: string, type: string, data: any): BaseTag<any> {
    const tagData = { value: data[name], __typename: data.__typename, key: name }
    //Special cases
    switch (data.__typename) {
      case "URL": {
        return new ImageTag(tagData)
      }
      case "PolyData": {
        //Here value is retreived from the sharedData Service because the file
        //is not downloaded or anything, it is from the previous screen
        return new ImagePolyData({ value: this.sharedData.getData("file") as File, __typename: data.__typename, key: name, applyTo: data[name] })
      }
      case "JSON": {
        const json = JSON.parse(data[name])
        const map = Object.keys(json).map(key => ({ key: key, value: json[key] }));
        return new JsonTag({ value: map, __typename: data.__typename, key: name })
      }
    }

    //scalar types
    switch (type) {
      case "Bool": {
        return new BoolTag(tagData)
      }
      case "Float": {
        return new FloatTag(tagData)
      }
      case "Int": {
        return new IntTag(tagData)
      }
      case "String": {
        return new StringTag(tagData)
      }
    }

    return new BaseTag({ value: '', __typename: data.__typename, key: '' })
  }
}

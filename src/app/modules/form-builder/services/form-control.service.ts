import { Injectable } from '@angular/core';
import { BaseTag } from '../reactive-tags/base-tag';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { ApolloQueryResult, InMemoryCache } from '@apollo/client/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IntrospectionReturnType } from 'src/app/shared/introspection.interface';
import { ShareDataResultService } from 'src/app/shared/services/share-data-result.service';
import { HttpLink } from 'apollo-angular/http';

import extractFiles from 'extract-files/extractFiles.mjs';
import isExtractableFile from 'extract-files/isExtractableFile.mjs';

/**
 * This service controls the creation of the angular form for each IA service
 * @remarks
 * If the result component needs info from the form view, this service should save it
 * in the shared service ShareDataResultService
 */
@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  constructor(private apollo: Apollo, private shareData: ShareDataResultService, private httpLink:HttpLink) { 
  }

  /**
   * 
   * @param tags Tags that represent the IA model params
   * @returns FormGroup: the reactiveforms class that has the tags and controls for the form
   */
  toFormGroup(tags: BaseTag<any>[]): FormGroup {
    const group: any = {};

    tags.forEach(tag => {
      group[tag.key] = tag.required ? new FormControl(tag.value || '', Validators.required)
        : new FormControl(tag.value || '');
    });
    return new FormGroup(group);
  }


  /**
   * Generates new apollo client with multipart capabilities
   * @param uri Url for the graphql IA Service
   */
  private genNewClient(uri: string) {
    this.apollo.removeClient()
    this.apollo.create(({
      cache: new InMemoryCache(),
      link: this.httpLink.create({ uri: `${environment.backendApi}/${uri}/graphql`, 
        extractFiles: (body) => extractFiles(body, isExtractableFile)
      }),
      //link: createUploadLink({ uri: `${environment.backendApi}/${uri}/graphql`,  })
    }))
  }

  /**
   * Builds the graphql query based on the graphql introspection return type
   * @param algorithm the name of the algorithm selected
   * @param param an instance of IntrospectionReturnType
   * @param fields the fields the Graphql query wants
   * @returns the graphql query ready to be sended to the backend
   * @remarks
   * Graphql does not accept empty '{}' so if the query doesnt have subtypes
   * the '{}' have to be removed from the query 
   */
  private buildQuery(algorithm: string, param: IntrospectionReturnType, fields: any) {
    if (param.ofType?.fields === null || param.ofType?.fields.length === 0) {
      return gql`
        query ExecuteAlgorithm($var: ${fields.type.ofType.name}!){
          ${algorithm}(${fields.name}: $var)
        }
      `
    }else{
      return gql`
        query ExecuteAlgorithm($var: ${fields.type.ofType.name}!){
          ${algorithm}(${fields.name}: $var){
            ${param.ofType?.fields?.map(e => e?.name).join('\n')}
          }
        }
      `
    }
  }

  /**
   * Sends the query to the backend 
   * @param form FormGroup with the info the user filled in the fields section
   * @param service The name of the service
   * @param algorithm the name of the graphql query that represents the algorithm
   * @param param IntrospectionReturnType that contains the return fields of the model
   * @param fields the fields the query awaits
   * @returns Observable: an rxjs observable with the result of the Graphql query. It also has the __typename
   * to build the response
   */
  sendQuery(form: FormGroup, service: string
      , algorithm: string, param: IntrospectionReturnType, fields: any): Observable<ApolloQueryResult<unknown>> {
    this.genNewClient(service)
    if(param.ofType?.name === "PolyData"){
      this.setData(form.get("file")?.value)
    }
    return this.apollo.query({
      query: this.buildQuery(algorithm, param, fields[0]),
      variables: {
        var: form.value
      },
      context: {
        useMultipart: true
      }
    })
  }
  
  /**
   * This method shared data with a common service with ResultComponent
   * In this prototype is only for Polydata but could be for anything
   * @param data Data that want to be shared with the result tab
   */
  private setData(data: any){
    this.shareData.addData("file", data)
  }
}

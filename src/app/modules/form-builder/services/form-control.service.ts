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

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  constructor(private apollo: Apollo, private shareData: ShareDataResultService, private httpLink:HttpLink) { 
  }

  toFormGroup(tags: BaseTag<any>[]) {
    const group: any = {};

    tags.forEach(tag => {
      group[tag.key] = tag.required ? new FormControl(tag.value || '', Validators.required)
        : new FormControl(tag.value || '');
    });
    return new FormGroup(group);
  }


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

  //This method shared data with a common service with ResultComponent
  //In this prototype is only for Polydata but could be for anything
  private setData(data: any){
    this.shareData.addData("file", data)
  }
}

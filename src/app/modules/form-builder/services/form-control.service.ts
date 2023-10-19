import { Injectable } from '@angular/core';
import { BaseTag } from '../reactive-tags/base-tag';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from 'src/environments/environment';
import { createUploadLink } from 'apollo-upload-client';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  constructor(private apollo: Apollo) { }

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
      //link: this.httpLink.create({ uri: `${environment.backendApi}/${uri}/graphql` }),
      link: createUploadLink({ uri: `${environment.backendApi}/${uri}/graphql` })
    }))
  }

  private buildQuery(algorithm: string, param: any, fields: any) {
    if (param.ofType.fields === null) {
      return gql`
        query ExecuteAlgorithm($var: ${fields.type.ofType.name}!){
          ${algorithm}(${fields.name}: $var)
        }
      `
    }else{
      return gql`
        query ExecuteAlgorithm($var: ${fields.type.ofType.name}!){
          ${algorithm}(${fields.name}: $var){
            ${param.ofType.fields?.map(e => e.name).join('\n')}
          }
        }
      `
    }
   
      

  }
  sendQuery(form: FormGroup, service: string, algorithm: string, param: any, fields: any) {
    this.genNewClient(service)
    this.apollo.query({
      query: this.buildQuery(algorithm, param, fields[0]),
      variables: {
        var: form.value
      },
      context: {
        useMultipart: true
      }
    }).subscribe({
      next: v => console.log(v),
      error: (e) => {
        console.error(e)
      }
    })
  }
}

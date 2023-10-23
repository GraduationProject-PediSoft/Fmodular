import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { introspectionQuery } from 'src/app/shared/introspection.graphql';
import { IntrospectionQueryResponse } from 'src/app/shared/introspection.interface';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {
  //https://atheros.ai/blog/graphql-introspection-and-introspection-queries

  constructor(private http: HttpClient, private apollo: Apollo, private httpLink: HttpLink){}

  getServices(): Observable<Iterable<string>>{
    return this.http.get<Iterable<string>>(environment.backendApi+"/explorer/")
  }

  getServiceInfo(path: string): Observable<IntrospectionQueryResponse>{
    this.genNewClient(path)

    return this.apollo.query<IntrospectionQueryResponse>({query: introspectionQuery})
      .pipe(
        map(v => v.data )
      )
  }



  private genNewClient(uri: string){
    this.apollo.removeClient()
    this.apollo.create(({
      cache: new InMemoryCache(),
      link: this.httpLink.create({uri: `${environment.backendApi}/${uri}/graphql`})
    }))
  }

}

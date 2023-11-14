import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { introspectionQuery } from 'src/app/shared/introspection.graphql';
import { IntrospectionQueryResponse } from 'src/app/shared/introspection.interface';

/**
 * This service contains methods to obtain the first service and algorithms in the system
 */
@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {

  constructor(private http: HttpClient, private apollo: Apollo, private httpLink: HttpLink){}

  /**
   * Obtains the IA services in the system
   * @returns an Observable with the Iterable that contains the name of the services avaliable in the system
   * @remarks
   * the names returned are also used to route the request in the apigateway
   */
  getServices(): Observable<Iterable<string>>{
    return this.http.get<Iterable<string>>(environment.backendApi+"/explorer/")
  }

  /**
   * Get algorithms in the Selected service
   * @param path Name of the service
   * @returns Observable with the IntrospectionQueryResponse
   */
  getServiceInfo(path: string): Observable<IntrospectionQueryResponse>{
    this.genNewClient(path)

    return this.apollo.query<IntrospectionQueryResponse>({query: introspectionQuery})
      .pipe(
        map(v => v.data )
      )
  }

  /**
   * Generated new graphql client with angular httpclient capacities
   * @param uri Url of the graphql server
   */
  private genNewClient(uri: string){
    this.apollo.removeClient()
    this.apollo.create(({
      cache: new InMemoryCache(),
      link: this.httpLink.create({uri: `${environment.backendApi}/${uri}/graphql`})
    }))
  }

}

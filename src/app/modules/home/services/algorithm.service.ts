import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {
  //https://atheros.ai/blog/graphql-introspection-and-introspection-queries

  constructor(private apollo: Apollo) {
    this.apollo.removeClient();
    this.apollo.create({
      cache: new InMemoryCache(),
      uri: "https://countries.trevorblades.com/"
    })

  }

  test() {
    const query = gql`
      fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: false) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}
fragment InputValue on __InputValue {
  name
  description
  type {
    ...TypeRef
  }
  defaultValue
}
fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}

query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    types {
      ...FullType
    }
    directives {
      name
      description
      locations
      args {
        ...InputValue
      }
    }
  }
}
    `
    this.apollo.query<any>({ query }).subscribe(data =>
      console.log(data)
    )
  }


}

import { gql } from "apollo-angular";

export const introspectionQuery = gql`
query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    # mutationType {
    #   name
    # }
    types {
      ...FullType
    }
  }
}
fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
  }
  inputFields {
    ...InputValue
  }
  # interfaces {
  #   ...TypeRef
  # }
  # enumValues(includeDeprecated: true) {
  #   name
  #   description
  #   isDeprecated
  #   deprecationReason
  # }
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
`
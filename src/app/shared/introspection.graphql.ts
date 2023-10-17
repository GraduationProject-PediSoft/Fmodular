import { gql } from "apollo-angular";

export const introspectionQuery = gql`
query IntrospectionQuery {
  __schema {
    queryType {
        fields{
            name
            # Esto es para el retorno
            type{
                ofType{
                    name
                    description
                }
            }
            args{
                name
                type{
                    ofType{
                        name
                        description
                        inputFields{
                            name
                            type{
                                ofType{
                                    name
                                    description
                                }
                            }
                        }
                    }
                }
            }

        }
    }
  }
}

`
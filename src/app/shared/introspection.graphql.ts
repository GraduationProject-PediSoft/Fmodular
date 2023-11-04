import { gql } from "apollo-angular";
/**
 * This file defines the introspection query the system uses to obtain info from the 
 * graphql server 
 */
export const introspectionQuery = gql`
query IntrospectionQuery {
    __schema {
        queryType {
            fields {
                name
                type {
                    ofType {
                        name
                        description
                        fields {
                            name
                            type {
                                kind
                                ofType{
                                    name
                                }
                            }
                        }
                    }
                }
                args {
                    name
                    type {
                        ofType {
                            name
                            description
                            inputFields {
                                name
                                description
                                type {
                                    ofType {
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

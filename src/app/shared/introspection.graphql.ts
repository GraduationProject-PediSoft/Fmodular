import { gql } from "apollo-angular";

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

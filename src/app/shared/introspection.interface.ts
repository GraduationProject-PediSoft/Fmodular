
/**
 * Return type info
 */
export interface IntrospectionReturnType {
    ofType: {
        name: string;
        description: string | null;
        fields: Array<{
            name: string;
            type: {
                kind: string;
                ofType:{
                    name: string
                }
            };
        } | null>;
    } | null;

}

/**
 * Param info
 */
export interface IntrospectionArgsType {
    name: string;
    type: {
        ofType: {
            name: string;
            description: string | null;
            inputFields: Array<{
                name: string;
                description: string | null;
                type: {
                    ofType: {
                        name: string;
                        description: string | null;
                    } | null;
                };
            } | null>;
        } | null;
    };
}

/**
 * General info for the Algorithm
 */
export interface IntrospectionFieldsType {
    name: string;
    type: IntrospectionReturnType
    args: Array<IntrospectionArgsType >;
}

/**
 * Main Type for the introspection result
 */
export interface IntrospectionQueryResponse {
    __schema: {
        queryType: {
            fields: Array<IntrospectionFieldsType| null>;
        };
    };
}
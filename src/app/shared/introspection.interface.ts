
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

export interface IntrospectionFieldsType {
    name: string;
    type: IntrospectionReturnType
    args: Array<IntrospectionArgsType >;
}
export interface IntrospectionQueryResponse {
    __schema: {
        queryType: {
            fields: Array<IntrospectionFieldsType| null>;
        };
    };
}
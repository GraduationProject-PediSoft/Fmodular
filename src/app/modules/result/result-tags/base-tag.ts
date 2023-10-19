export class BaseTag<T>{
    value: T
    key: string
    description: string
    type: string

    constructor(options:{
        value: T;
        key: string;
        description: string
        type?: string;
    }){
        this.value = options.value
        this.key = options.key
        this.description = options.description
        this.type = options.type || ''
    }
}
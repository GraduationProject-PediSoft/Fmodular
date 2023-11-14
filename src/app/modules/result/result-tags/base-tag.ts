import { Applier } from "../interfaces/Applier.interface";

/**
 * The base tag for the result view
 * @remarks
 * ApplyTo defines an interface to apply things to something
 * For this prototype is purely for the integrated visualizer
 * But because it is an interface it could be applied for abything 
 */
export class BaseTag<T, U extends Applier<T>| undefined = undefined>{
    value: T
    __typename: string
    description: string
    type: string
    key: string
    applyTo: U | undefined

    constructor(options:{
        value: T
        key: string
        description?: string
        type?: string
        applyTo?: U
        __typename: string
    }){
        this.value = options.value
        this.key = options.key
        this.description = options.description || ''
        this.type = options.type || ''
        this.applyTo = options.applyTo
        this.__typename = options.__typename
    }
}
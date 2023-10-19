import { Applier } from "../interfaces/Applier.interface";

export class BaseTag<T, U extends Applier<T>| undefined = undefined>{
    value: T
    key: string
    description: string
    type: string
    applyTo: U | undefined

    constructor(options:{
        value: T
        key: string
        description: string
        type?: string
        applyTo?: U
    }){
        this.value = options.value
        this.key = options.key
        this.description = options.description
        this.type = options.type || ''
        this.applyTo = options.applyTo
    }
}
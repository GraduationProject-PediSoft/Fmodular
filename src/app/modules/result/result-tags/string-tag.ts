import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<string>
 * Tag for the graphql String scalar type
 */
export class StringTag extends BaseTag<string>{
    override type: string = "stringbox"; 
}
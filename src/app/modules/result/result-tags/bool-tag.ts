import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<boolean>
 * Tag for the graphql Boolean scalar type
 */
export class BoolTag extends BaseTag<boolean>{
    override type: string = 'boolbox';
}
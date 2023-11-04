import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<number>
 * Tag for the graphql Float scalar type
 */
export class FloatTag extends BaseTag<number>{
    override type: string = 'floatbox';
}
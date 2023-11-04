import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<number>
 * Tag for the graphql Int scalar type
 */
export class IntTag extends BaseTag<number>{
    override type: string = 'intbox';
}
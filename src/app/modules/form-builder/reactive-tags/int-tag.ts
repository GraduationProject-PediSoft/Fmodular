import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<number>
 * A tag to represent the graphql Int Scalar type
 */
export class IntTag extends BaseTag<number>{
    override controlType: string = "intbox"
}
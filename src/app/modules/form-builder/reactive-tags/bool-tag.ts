import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<boolean>
 * A tag to represent the graphql Boolean Scalar type
 */
export class BoolTag extends BaseTag<boolean>{
    override controlType: string = "boolbox";
}
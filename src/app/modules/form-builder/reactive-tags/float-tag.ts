import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<number>
 * A tag to represent the graphql Float Scalar type
 */
export class FloatTag extends BaseTag<number>{
    override controlType: string = "floatbox";
}
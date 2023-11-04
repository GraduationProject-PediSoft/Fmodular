import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<string>
 * A tag to represent the graphql String Scalar type
 */
export class StringTag extends BaseTag<string>{
    override controlType: string = "stringbox"
}
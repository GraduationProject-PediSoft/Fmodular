import { BaseTag } from "./base-tag";

export class StringTag extends BaseTag<string>{
    override controlType: string = "stringbox"
}
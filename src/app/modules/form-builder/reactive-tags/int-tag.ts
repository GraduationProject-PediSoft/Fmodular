import { BaseTag } from "./base-tag";

export class IntTag extends BaseTag<number>{
    override controlType: string = "intbox"
}
import { BaseTag } from "./base-tag";

export class BoolTag extends BaseTag<boolean>{
    override controlType: string = "boolbox";
}
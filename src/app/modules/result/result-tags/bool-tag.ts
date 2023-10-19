import { BaseTag } from "./base-tag";

export class BoolTag extends BaseTag<boolean>{
    override type: string = 'boolbox';
}
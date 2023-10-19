import { BaseTag } from "./base-tag";

export class FloatTag extends BaseTag<number>{
    override type: string = 'floatbox';
}
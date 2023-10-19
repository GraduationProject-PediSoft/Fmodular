import { BaseTag } from "./base-tag";

export class IntTag extends BaseTag<number>{
    override type: string = 'intbox';
}
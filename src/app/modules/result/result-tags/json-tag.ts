import { BaseTag } from "./base-tag";

export class JsonTag extends BaseTag<JSON>{
    override type: string = "json";
}
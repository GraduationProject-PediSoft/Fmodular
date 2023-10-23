import { BaseTag } from "./base-tag";

export class JsonTag extends BaseTag<{ key: string, value: any }[]>{
    override type: string = "json";
}
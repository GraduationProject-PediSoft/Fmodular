import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<boolean>
 * Tag for the custom type JSON an object of type key-value,
 * this tag displays a table
 */
export class JsonTag extends BaseTag<{ key: string, value: any }[]>{
    override type: string = "json";
}
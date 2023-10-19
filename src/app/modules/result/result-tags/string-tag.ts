import { BaseTag } from "./base-tag";

export class StringTag extends BaseTag<string>{
    override type: string = "visualizer"; 
}
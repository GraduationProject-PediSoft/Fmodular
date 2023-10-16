import { BaseTag } from "./base-tag";

export class ImageTag extends BaseTag<File>{
    override controlType: string = "visualizer";
}
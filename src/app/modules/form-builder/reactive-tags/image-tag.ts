import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<File>
 * the file is an image supported by the visualizer
 * The tag represents the Upload graphql type  
 */
export class ImageTag extends BaseTag<File>{
    override controlType: string = "visualizer";
}
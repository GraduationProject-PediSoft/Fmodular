import { BaseTag } from "./base-tag";

export class ImageTag extends BaseTag<File>{
    override type: string = 'visualizer';
}
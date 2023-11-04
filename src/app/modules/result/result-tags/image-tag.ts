import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<boolean>
 * Tag for the custom type URL
 * In the web world, the backend cant return a direct image, it returns an URL
 * this represents an url for the client to download and render
 */
export class ImageTag extends BaseTag<File>{
    override type: string = 'visualizer';
}
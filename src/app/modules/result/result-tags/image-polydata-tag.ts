import { BaseTag } from "./base-tag";

/**
 * @extends BaseTag<File>
 * Tag for the custom type PolyData, this data is applied to the visualizer
 */
export class ImagePolyData extends BaseTag<File>{
    override type: string = "visualizer-polydata";
}
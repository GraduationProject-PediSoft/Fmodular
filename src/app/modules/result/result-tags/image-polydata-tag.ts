import { BaseTag } from "./base-tag";

export class ImagePolyData extends BaseTag<File>{
    override type: string = "visualizer-polydata";
}
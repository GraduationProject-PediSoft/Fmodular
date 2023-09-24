import { Component, ElementRef, ViewChild } from '@angular/core';

import '@kitware/vtk.js/Rendering';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';

import { Image, readDICOMTags, readImageArrayBuffer } from 'itk-wasm'
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkMouseCameraTrackballZoomManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballZoomManipulator';
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';
import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage';
import vtkLineWidget from '@kitware/vtk.js/Widgets/Widgets3D/LineWidget';
import vtkRectangleWidget from '@kitware/vtk.js/Widgets/Widgets3D/RectangleWidget';
import vtkEllipseWidget from '@kitware/vtk.js/Widgets/Widgets3D/EllipseWidget';
import vtkSplineWidget from '@kitware/vtk.js/Widgets/Widgets3D/SplineWidget';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';
import vtkAbstractWidget from '@kitware/vtk.js/Widgets/Core/AbstractWidget';
import { BehaviorCategory, ShapeBehavior } from '@kitware/vtk.js/Widgets/Widgets3D/ShapeWidget/Constants';

@Component({
  selector: 'app-vtk-visualizer',
  template: '<div #visualizer></div>'
})
export class VtkVisualizerComponent {
  @ViewChild("visualizer", { static: true })
  visualizer!: ElementRef



}

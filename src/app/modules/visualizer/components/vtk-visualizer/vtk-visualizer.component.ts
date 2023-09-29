import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

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
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TagsComponent } from '../tags/tags.component';
import { TagsService } from '../../services/tags.service';


@Component({
  selector: 'app-vtk-visualizer',
  templateUrl: './vtk-visualizer.component.html',
  styleUrls: ['./vtk-visualizer.component.scss']
})
export class VtkVisualizerComponent {
  @ViewChild("visualizer", { static: true })
  visualizer!: ElementRef

  readonly itemsMenu = [
    {
      label: 'Widgets',
      icon: 'pi pi-fw pi-palette',
      items: [
        {
          label: 'Nuevo',
          icon: 'pi pi-fw pi-plus',
          items: [
            {
              label: 'Línea',
              items: [
                {
                  label: 'Añadir',
                  command: () => this.visualizationCompleted ? this.addLine() : undefined
                },
                {
                  label: 'Eliminar',
                  command: () => this.visualizationCompleted ? this.deleteLine() : undefined
                }
              ]
            },
            {
              label: 'Rectángulo',
              command: () => this.visualizationCompleted ? this.onWidgetChangeSelection('Rectángulo') : undefined
            },
            {
              label: 'Elipse',
              command: () => this.visualizationCompleted ? this.onWidgetChangeSelection('Elipse') : undefined
            },
            {
              label: 'Circulo',
              command: () => this.visualizationCompleted ? this.onWidgetChangeSelection('Circulo') : undefined
            },
            {
              label: 'Spline',
              command: () => this.visualizationCompleted ? this.onWidgetChangeSelection('Spline') : undefined
            },
          ]
        },
        {
          label: 'Eliminar todos',
          icon: 'pi pi-fw pi-trash',
          command: () => this.visualizationCompleted ? this.deleteAllWidgets() : undefined
        }
      ]
    },
    {
      label: 'Mostrar Tags',
      icon: 'pi pi-fw pi-tags',
      command: () => this.showTags()
    }
  ];

  constructor(private dialogService: DialogService,
    private cdRef: ChangeDetectorRef, private tagsService: TagsService){}


  //ImageVisualization -- One time for Image
  renderWindow = vtkRenderWindow.newInstance()
  renderer = vtkRenderer.newInstance()
  openGlRenderWindow = vtkOpenGLRenderWindow.newInstance()
  actor = vtkImageSlice.newInstance()
  mapper = vtkImageMapper.newInstance()
  visualizationCompleted: boolean = false;

  //Image Style
  style = vtkInteractorStyleManipulator.newInstance();
  interactor = vtkRenderWindowInteractor.newInstance()
  styleImage = vtkInteractorStyleImage.newInstance();
  imageInteractor = vtkRenderWindowInteractor.newInstance();

  //Response Visualization
  renderWindowResponse = vtkRenderWindow.newInstance()
  rendererResponse = vtkRenderer.newInstance()
  openGlRenderWindowResponse = vtkOpenGLRenderWindow.newInstance()
  actorResponse = vtkImageSlice.newInstance()
  mapperResponse = vtkImageMapper.newInstance()

  //Widgets
  newLine: any
  lineWidget = vtkLineWidget.newInstance()
  widgetManager = vtkWidgetManager.newInstance();
  distanceLineWidget: string | undefined
  selectedLineWidgetIndex: number | undefined | null


  //Tags Dialog
  ref: DynamicDialogRef | undefined;
  dynamicDialog: boolean = false;
  tags: Map<string, string> = new Map<string, string>();

  //File to display
  @Input()
  file: File | null = null




  showTags(): DynamicDialogRef {
    this.ref = this.dialogService.open(TagsComponent, {
      header: 'DICOM Tags'
    });
    const dialogRef = this.dialogService.dialogComponentRefMap.get(this.ref);
    const dynamicComponent = dialogRef?.instance as DynamicDialogComponent;

    const ariaLabelledBy = dynamicComponent.getAriaLabelledBy();
    dynamicComponent.getAriaLabelledBy = () => ariaLabelledBy;
    return this.ref;
  }

  onWidgetChangeSelection(selectedOption:string): void {

    this.widgetManager.setRenderer(this.renderer)
    const rectangleWidget = vtkRectangleWidget.newInstance()
    const ellipseWidget = vtkEllipseWidget.newInstance()
    const circleWidget = vtkEllipseWidget.newInstance({
      modifierBehavior: {
        None: {
          [BehaviorCategory.PLACEMENT]:
            ShapeBehavior[BehaviorCategory.PLACEMENT].CLICK_AND_DRAG,
          [BehaviorCategory.POINTS]: ShapeBehavior[BehaviorCategory.POINTS].RADIUS,
          [BehaviorCategory.RATIO]: ShapeBehavior[BehaviorCategory.RATIO].FREE,
        },
      },
    })
    const splineWidget = vtkSplineWidget.newInstance({
      resetAfterPointPlacement: true,
    });

    const lineHandle = this.widgetManager.addWidget(this.lineWidget);
    const rectangleHandle = this.widgetManager.addWidget(rectangleWidget);
    const ellipseHandle = this.widgetManager.addWidget(ellipseWidget);
    const circleHandle = this.widgetManager.addWidget(circleWidget);
    const splineHandle = this.widgetManager.addWidget(splineWidget);

    const widgetNameToHandleMap = {
      'Línea': lineHandle,
      'Rectángulo': rectangleHandle,
      'Elipse': ellipseHandle,
      'Circulo': circleHandle,
      'Spline': splineHandle,
    };

    if (widgetNameToHandleMap.hasOwnProperty(selectedOption)) {
      if (selectedOption == 'Línea') {
        this.addLine()
      } else {
        const selectedWidgetHandle = widgetNameToHandleMap[selectedOption];
        this.widgetManager.grabFocus(selectedWidgetHandle);
      }
    }

  }


  setWidgetLineColor(currentWidget: any, color: any): void {

    if (currentWidget) {
      currentWidget.getWidgetState().getHandle1().setColor(color);
      currentWidget.getWidgetState().getHandle2().setColor(color);

      currentWidget.setUseActiveColor(false);
      currentWidget.getWidgetState().getMoveHandle().setColor(0.3);
    }

  }


  unselectLineWidget(index: number): void {
    if (index != null) {
      const widgetToUnselect = this.widgetManager?.getWidgets()[this.selectedLineWidgetIndex!];
      this.setWidgetLineColor(widgetToUnselect, 0.5);
    }
    if (index === this.selectedLineWidgetIndex) {
      this.selectedLineWidgetIndex = null;
    }
  }

  selectLineWidget(index: number): void {
    this.unselectLineWidget(this.selectedLineWidgetIndex!);
    if (index != null) {
      const widgetToSelect = this.widgetManager?.getWidgets()[index];
      this.setWidgetLineColor(widgetToSelect, 0.1);
    }
    this.selectedLineWidgetIndex = index
  }

  calculateLineDistance(widget: any): void {
    this.newLine.onInteractionEvent(() => {
      const distance = widget.getDistance().toFixed(2);
      this.distanceLineWidget = distance;
    });
    this.newLine.onEndInteractionEvent(() => {
      const distance = widget.getDistance().toFixed(2);
      this.distanceLineWidget = distance
    });
  }

  addLine(): void {
    this.widgetManager.setRenderer(this.renderer);
    let currentHandle: vtkAbstractWidget | null = null
    const widget = vtkLineWidget.newInstance()
    currentHandle = this.widgetManager.addWidget(widget);
    this.newLine = currentHandle;

    this.selectLineWidget(this.widgetManager?.getWidgets().length! - 1)

    this.calculateLineDistance(widget)

    this.widgetManager.grabFocus(this.newLine)

    currentHandle!.onStartInteractionEvent(() => {
      const index = this.widgetManager?.getWidgets().findIndex((widget) => {
        return currentHandle!.getWidgetState() === widget.getWidgetState() ? 1 : 0;
      });
      this.selectLineWidget(index!)
      this.newLine = currentHandle
    })
  }

  deleteLine(): void {
    const widget = this.widgetManager.getWidgets()[0]
    this.widgetManager.removeWidget(widget);
    this.cdRef.detectChanges()
  }

  deleteAllWidgets(): void {
    this.widgetManager.removeWidgets()
  }

  responseVisualization(image: vtkImageData): void {

    this.renderWindowResponse.addRenderer(this.rendererResponse)

    this.openGlRenderWindowResponse.setContainer(this.visualizer.nativeElement)
    this.openGlRenderWindowResponse.setSize(500, 500)
    this.renderWindowResponse.addView(this.openGlRenderWindowResponse)

    this.actorResponse.setMapper(this.mapperResponse)
    this.rendererResponse.addActor(this.actorResponse)
    this.mapperResponse.setInputData(image)

  }

  imageRendering(image: vtkImageData): void {

    image.setDirection([1, 0, 0, 0, 1, 0, 0, 0, 1]); // Establecer la dirección correcta de la imagen
    image.setOrigin([0, 0, 0]); // Establecer el origen correcto para la visualización

    this.renderWindow.addRenderer(this.renderer)

    this.openGlRenderWindow.setContainer(this.visualizer.nativeElement)
    this.openGlRenderWindow.setSize(1200, 680)
    this.renderWindow.addView(this.openGlRenderWindow)

    this.actor.setMapper(this.mapper)
    this.renderer.addActor(this.actor)
    this.mapper.setInputData(image)

    // Interactor que maneja los eventos del mouse
    this.interactor.setView(this.openGlRenderWindow)
    this.interactor.initialize()
    this.interactor.bindEvents(this.visualizer.nativeElement)
    this.interactor.setInteractorStyle(this.style)

    // Interactor que maneja el estilo de la imagen (ventaneo)
    this.imageInteractor.setView(this.openGlRenderWindow);
    this.imageInteractor.initialize();
    this.imageInteractor.bindEvents(this.visualizer.nativeElement);
    this.imageInteractor.setInteractorStyle(this.styleImage);


    //Establecer eventos en los botones del mouse

    const mousePanning =
      vtkMouseCameraTrackballPanManipulator.newInstance({
        button: 2,
      });
    this.style.addMouseManipulator(mousePanning);

    const mouseZooming =
      vtkMouseCameraTrackballZoomManipulator.newInstance({
        button: 3,
      });
    this.style.addMouseManipulator(mouseZooming);


    //Ajustar ventana y nivel para mejorar visualización de Imágenes

    const imageProperty = this.actor.getProperty();
    const scalarRange = image.getPointData().getScalars().getRange();
    const window = scalarRange[1] - scalarRange[0];
    const level = (scalarRange[0] + scalarRange[1]) / 2;

    imageProperty.setColorLevel(level);
    imageProperty.setColorWindow(window);


    // Se ajusta la cámara para que las imágenes tengan la orientación adecuada

    const camera = this.renderer.getActiveCamera();
    camera.setOrientationWXYZ(180, 1, 0, 0)
    camera.zoom(1)

    this.renderer.resetCamera()
    this.renderWindow.render()
    this.visualizationCompleted = true

  }

  //TODO Fix broken dicom-tag-dictionary
  // getDICOMTags(tags: Map<string, string>): void {
  //   const tagsMap = new Map<string, string>()
  //   var dicomDataDictionary = require('dicom-data-dictionary');
  //   var dictionary = new dicomDataDictionary.DataElementDictionary();
  //   tags.forEach((value, key) => {
  //     const newKey = key.replace(/\|/g, '')
  //     tagsMap.set(newKey, value)
  //   })

  //   tags.clear()
  //   tagsMap.forEach((value, key) => {
  //     var element = dictionary.lookup(key);
  //     if (element) {
  //       tags.set(element.name, value);
  //     }
  //   })
  //   this.tagsService.setTagsData(tags)
  // }

}

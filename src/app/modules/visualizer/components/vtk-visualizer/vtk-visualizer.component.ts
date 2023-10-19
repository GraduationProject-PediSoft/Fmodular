import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import '@kitware/vtk.js/Rendering';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';

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
import { readDICOMTags, readImageArrayBuffer } from 'itk-wasm';
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import { MenuItem } from 'primeng/api';
import { Applier } from 'src/app/modules/result/interfaces/Applier.interface';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';


@Component({
  selector: 'app-vtk-visualizer',
  templateUrl: './vtk-visualizer.component.html',
  styleUrls: ['./vtk-visualizer.component.scss']
})
export class VtkVisualizerComponent implements OnChanges, Applier<any> {
  //Visualizer container
  @ViewChild("visualizer", { static: true })
  visualizer!: ElementRef

  //File to display
  @Input()
  file: File | null = null

  //Polydata points to apply after a result
  @Input()
  applierData: any

  //Items as a stream 
  itemsMenu: MenuItem[] = []

  get items() {
    return [
      {
        label: 'Widgets',
        icon: 'pi pi-fw pi-palette',
        disabled: this.file == null,
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
        command: () => this.showTags(),
        disabled: this.file?.type !== "application/dicom"

      }
    ]
  }

  constructor(private dialogService: DialogService,
    private cdRef: ChangeDetectorRef, private tagsService: TagsService) { }

  apply(data: any): void {
    const contours = JSON.parse(data);
    const points = vtkPoints.newInstance();
    const lines = vtkCellArray.newInstance();

    // Agregar puntos y líneas al vtkPolyData
    for (const contour of contours) {
      const lineIndices: any = [];
      for (const point of contour) {
        const pointId = points.insertNextPoint(point[1], point[0], 0);
        lineIndices.push(pointId);
      }
      lines.insertNextCell(lineIndices);
    }

    const polyData = vtkPolyData.newInstance();
    polyData.setPoints(points);
    polyData.setLines(lines);

    const mapper = vtkMapper.newInstance();
    mapper.setInputData(polyData);

    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);

    const actorProperty = actor.getProperty();
    actorProperty.setColor(1, 0, 0);

    this.renderer.addActor(actor)
    this.renderWindow.render()
  }




  //ImageVisualization -- One time for Image
  private renderWindow = vtkRenderWindow.newInstance()
  private renderer = vtkRenderer.newInstance()
  private openGlRenderWindow = vtkOpenGLRenderWindow.newInstance()
  private actor = vtkImageSlice.newInstance()
  private mapper = vtkImageMapper.newInstance()
  private visualizationCompleted: boolean = false;

  //Image Style
  private style = vtkInteractorStyleManipulator.newInstance();
  private interactor = vtkRenderWindowInteractor.newInstance()
  private styleImage = vtkInteractorStyleImage.newInstance();
  private imageInteractor = vtkRenderWindowInteractor.newInstance();

  //Response Visualization
  private renderWindowResponse = vtkRenderWindow.newInstance()
  private rendererResponse = vtkRenderer.newInstance()
  private openGlRenderWindowResponse = vtkOpenGLRenderWindow.newInstance()
  private actorResponse = vtkImageSlice.newInstance()
  private mapperResponse = vtkImageMapper.newInstance()

  //Widgets
  private newLine: any
  private lineWidget = vtkLineWidget.newInstance()
  private widgetManager = vtkWidgetManager.newInstance();
  private distanceLineWidget: string | undefined
  private selectedLineWidgetIndex: number | undefined | null


  //Tags Dialog
  private ref: DynamicDialogRef | undefined;



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file']) {
      this.itemsMenu = this.items
      this.render()
    }
  }


  render() {
    if (this.file == null) {
      return
    }

    const reader = new FileReader();

    reader.onload = async (iEvent: any) => {
      const arrayBuffer = iEvent.target.result;
      const array = new Uint8Array(arrayBuffer);
      const { image: itkImage, webWorker } = await readImageArrayBuffer(null,
        array.buffer, this.file!.name, this.file!.type);

      if (this.file?.type === "application/dicom") {
        const { tags: tags } = await readDICOMTags(webWorker, this.file)
        this.getDICOMTags(tags)
      }
      const image = vtkITKHelper.convertItkToVtkImage(itkImage);

      this.imageRendering(image)
    };

    reader.readAsArrayBuffer(this.file);
  }


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

  onWidgetChangeSelection(selectedOption: string): void {

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
    this.renderer.setBackground(203 / 255, 213 / 255, 225 / 255)

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

  getDICOMTags(tags: Map<string, string>): void {
    const tagsMap = new Map<string, string>()
    const dictionary = require('@iwharris/dicom-data-dictionary');
    tags.forEach((value, key) => {
      const newKey = key.replace(/(\d+)\|(\d+)/, '($1,$2)');
      tagsMap.set(newKey, value)
    })

    tags.clear()
    tagsMap.forEach((value, key) => {
      const element = dictionary.get_element(key);

      if (element && element.keyword) {
        tags.set(element.keyword, value);
      }
    });
    this.tagsService.setTagsData(tags)
  }


}

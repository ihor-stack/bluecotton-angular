import { Component, TemplateRef, ViewChild, Input } from '@angular/core';
import { Color } from '../../colors/color';
import { ColorsService } from '../../colors/colors.service';
import { DesignsService } from '../../designs/designs.service';
import { DialogService, DialogRef } from '../../ui/dialog.service';
import { Element } from '../../element';
import { ElementComponent } from '../element.component';
import { ShapeElement } from './shape-element';
import { ShapePickerComponent } from './shape-picker.component';
import { SvgService } from '../../services/svg.service';

@Component({
  selector: 'app-shape-element',
  styleUrls: ['./shape-element.component.scss'],
  templateUrl: './shape-element.component.html'
})
export class ShapeElementComponent extends ElementComponent {
  private availableColors: Color[];
  private blockNumber = 1;
  @ViewChild('shapeEditor') editDialog: TemplateRef<any>;
  @ViewChild(ShapePickerComponent) shapePickerComponent: ShapePickerComponent;
  private dialogRef: DialogRef;
  @Input() isMobile: string;

  constructor(
    protected dialogService: DialogService,
    protected designsService: DesignsService,
    protected svgService: SvgService,
    private colorsService: ColorsService,
  ) {
    super(designsService, dialogService, svgService);
    if (window.innerWidth <= 600) {
      this.blockNumber = 3;
    }
  }

  protected additionalOnInit() {
    this.colorsService.getColors().subscribe(colors => this.availableColors = colors);
  }

  openShapePicker() {
    this.dialogService.closeAll();
    this.shapePickerComponent.open();
  }

  new(type: string) {
    const area = this.currentDesign.currentArea;
    this.currentElement = new ShapeElement(area, type);
    this.currentElement.fill = this.availableColors[0];
    this.currentElement.render().subscribe(() => {
      this.designsService.addElement(area, this.currentElement);
    });
  }

  edit(element: Element) {
    this.currentElement = element;
    this.dialogRef = this.dialogService.open(this.editDialog, { name: 'shape-element', size: 'lg', block: this.blockNumber, groups: ['edit-element'] });
  }

  doneEditing() {
    if (this.dialogRef) {
      this.dialogService.close(this.dialogRef);
    }
    super.doneEditing();
  }


  protected beforeRemove() {
    if (this.dialogRef) {
      this.dialogService.close(this.dialogRef);
    }
  }

  protected modelClass(): string {
    return 'ShapeElement';
  }
}

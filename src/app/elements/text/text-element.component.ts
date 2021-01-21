import { Component, ViewChild, TemplateRef, Input } from '@angular/core';
import { Color } from '../../colors/color';
import { ColorsService } from '../../colors/colors.service';
import { DesignsService } from '../../designs/designs.service';
import { DialogService, DialogRef } from '../../ui/dialog.service';
import { Element } from '../../element';
import { ElementComponent } from '../element.component';
import { Font } from '../../ui/font.interfaces';
import { FontPickerService } from '../../ui/font-picker.service';
import { SvgService } from '../../services/svg.service';
import { TextElement } from './text-element';

@Component({
  selector: 'app-text-element',
  styleUrls: ['./text-element.component.scss'],
  templateUrl: './text-element.component.html'
})
export class TextElementComponent extends ElementComponent {
  private availableColors: Color[];
  private dialogRef: DialogRef;
  private blockNumber = 1;
  @ViewChild('textEditor') editDialog: TemplateRef<any>;
  @Input() isMobile: string;
  private maxCharsPerLine = 50;
  ready = false;
  defaultFont: Font = null;
  _showEffects = false;

  constructor(
    protected dialogService: DialogService,
    protected designsService: DesignsService,
    protected svgService: SvgService,
    private colorsService: ColorsService,
    private fontService: FontPickerService,
  ) {
    super(designsService, dialogService, svgService);
    if (window.innerWidth <= 600) {
      this.blockNumber = 3;
    }
  }

  protected additionalOnInit() {
    // make sure we have colors, defaultFont, and design written to svg before showing
    this.colorsService.getColors().subscribe((colors) => {
      this.availableColors = colors;
      this.fontService.getFont(this.fontService.defaultFontFamily()).subscribe((font) => {
        this.defaultFont = font;
        this.ready = true;
      });
    });
  }

  new() {
    // go ahead and draw a default Text element
    const area = this.currentDesign.currentArea;
    this.currentElement = new TextElement(area);
    this.currentElement.fill = this.availableColors[0];
    this.currentElement.editing = true;
    this.currentElement.font = this.defaultFont;
    this.currentElement.textChanged = true;
    this.currentElement.render().subscribe(() => {
      this.designsService.addElement(area, this.currentElement);
    });
  }

  edit(element: Element) {
    this.currentElement = element;
    this._showEffects = false;
    this.dialogRef = this.dialogService.open(this.editDialog, {name: 'text-element', size: 'xl', block: this.blockNumber, groups: ['edit-element'] });
  }

  doneEditing() {
    if (this.dialogRef) {
      this.dialogService.close(this.dialogRef);
    }
    super.doneEditing();
  }

  showEffects() {
    return this._showEffects;
  }

  showBasic() {
    return !this._showEffects;
  }

  toggleShowEffects(event: any) {
    this._showEffects = !this._showEffects;
    event.stopPropagation();
  }

  onChanges(property: string, value: any) {
    if (property === 'text') {
      value = this.enforceMaxCharsPerLine(value);
      this.currentElement.textChanged = true;
    } else if (property === 'font') {
      this.currentElement.textChanged = true;
      this.currentElement.lineSpacing = null;
    }
    super.onChanges(property, value);
  }

  getCurrentDesign() {
    return this.currentDesign;
  }

  protected beforeRemove() {
    if (this.dialogRef) {
      this.dialogService.close(this.dialogRef);
    }
  }

  protected modelClass(): string {
    return 'TextElement';
  }

  private enforceMaxCharsPerLine(value): string {
    const lines = value.split(/(\r\n|\n|\r)/gm);
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > this.maxCharsPerLine) {
        lines[i] = lines[i].substring(0, this.maxCharsPerLine)
          + '\n' + lines[i].substring(this.maxCharsPerLine, lines[i].length);
      }
    }
    return lines.join('');
  }
}

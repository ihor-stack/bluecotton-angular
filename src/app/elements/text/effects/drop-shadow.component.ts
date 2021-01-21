import { Component, Input } from '@angular/core';
import { Color } from '../../../colors/color';
import { ColorsService } from '../../../colors/colors.service';
import { DropShadow } from './drop-shadow';
import { EffectComponent } from '../../effect.component';
import { TextElement } from '../text-element';
import { TextElementComponent } from '../text-element.component';
import * as _ from 'lodash';

const DROP_SHADOW_COLOR_ID = 22;

@Component({
  selector: 'app-drop-shadow',
  styleUrls: ['./drop-shadow.component.scss'],
  templateUrl: './drop-shadow.component.html',
})
export class DropShadowComponent extends EffectComponent {
  @Input() element: TextElement;
  public effect: DropShadow;
  elementComponent: TextElementComponent;
  private availableColors: Color[];

  constructor(elementComponent: TextElementComponent, private colorsService: ColorsService) {
    super(elementComponent);
  }

  additionalOnInit() {
    this.availableColors = this.colorsService.loadedColors;

    if (!this.effect.color) {
      this.effect.color = _.find(this.colorsService.loadedColors, { 'id': DROP_SHADOW_COLOR_ID });
    }

    this.onEffectChanges('color', this.effect.color);
  }

  onEffectChanges(property: string, value: any) {
    if (property === 'enabled') {
      this.effect.enabled = value;
      if (value === false) {
        this.effect.removeEffect();
      }
    }
    super.onEffectChanges(property, value);
  }

  onSelectColor(color: Color) {
    if (color.id === 'GARMENT_COLOR') {
      color.rgb = this.elementComponent.getCurrentDesign().productColor.elementSwatch();
    }
    this.onEffectChanges('color', color);
  }

  protected newEffect(): DropShadow {
    return new DropShadow();
  }

  protected effectClass(): string {
    return 'DropShadow';
  }

}

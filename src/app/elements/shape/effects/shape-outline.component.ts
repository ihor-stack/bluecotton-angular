import { Component, Input } from '@angular/core';
import { Color } from '../../../colors/color';
import { ColorsService } from '../../../colors/colors.service';
import { EffectComponent} from '../../effect.component';
import { ShapeOutline } from './shape-outline';
import { ShapeElement } from '../shape-element';
import { ShapeElementComponent } from '../shape-element.component';

@Component({
  selector: 'app-outline',
  styleUrls: ['./app-outline.component.scss'],
  templateUrl: './app-outline.component.html',
})
export class ShapeOutlineComponent extends EffectComponent {
  @Input() element: ShapeElement;
  public effect: ShapeOutline;
  elementComponent: ShapeElementComponent;
  private availableColors: Color[];

  constructor(elementComponent: ShapeElementComponent, private colorsService: ColorsService) {
    super(elementComponent);
  }

  additionalOnInit() {
    this.availableColors = this.colorsService.loadedColors;

    if (!this.effect.color) {
      // pick first available color which isn't already being used
      const usedColors = this.element.colors();
      const color = this.availableColors.find((c) => {
        if (!usedColors.find((uc) => uc.id === c.id)) {
          return true;
        }
      });
      this.onSelectColor(color);
    }
  }

  onSelectColor(color: Color) {
    this.onEffectChanges('color', color);
  }

  protected newEffect(): ShapeOutline {
    return new ShapeOutline();
  }

  protected effectClass(): string {
    return 'ShapeOutline';
  }
}

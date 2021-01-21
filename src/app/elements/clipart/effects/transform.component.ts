import { Component, Input } from '@angular/core';
import { EffectComponent } from '../../effect.component';
import { Transform } from './transform';
import { ClipartElement } from '../clipart-element';
import { ClipartComponent } from '../clipart.component';

@Component({
  selector: 'app-transform',
  styleUrls: ['./transform.component.scss'],
  templateUrl: './transform.component.html',
})
export class TransformComponent extends EffectComponent {
  @Input() element: ClipartElement;
  public effect: Transform;
  elementComponent: ClipartComponent;
  constrain = true;

  constructor(elementComponent: ClipartComponent) {
    super(elementComponent);
  }

  protected newEffect(): Transform {
    return new Transform();
  }

  protected effectClass(): string {
    return 'Transform';
  }

  onEffectChanges(property: string, value: any) {
    if (property === 'height') {
      const scaleH = value / this.element.height;
      const scaleW = this.constrain ? scaleH : 1;

      this.element.scale(scaleW, scaleH);

    } else if (property === 'width') {
      const scaleW = value / this.element.width;
      const scaleH = this.constrain ? scaleW : 1;

      this.element.scale(scaleW, scaleH);

    } else if (property === 'rotationDegrees') {
      this.element.rotate(value);
    }
    super.onEffectChanges(property, value);
  }
}

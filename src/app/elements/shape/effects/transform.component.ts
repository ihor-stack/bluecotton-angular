import { Component, Input } from '@angular/core';
import { EffectComponent } from '../../effect.component';
import { Transform } from './transform';
import { ShapeElement } from '../shape-element';
import { ShapeElementComponent } from '../shape-element.component';

@Component({
  selector: 'app-transform',
  styleUrls: ['./transform.component.scss'],
  templateUrl: './transform.component.html',
})
export class TransformComponent extends EffectComponent {
  @Input() element: ShapeElement;
  public effect: Transform;
  elementComponent: ShapeElementComponent;
  constrain = true;

  constructor(elementComponent: ShapeElementComponent) {
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

import { Component, Input } from '@angular/core';
import { EffectComponent } from '../../effect.component';
import { Transform } from './transform';
import { ImageUploadElement } from '../image-upload-element';
import { ImageUploadComponent } from '../image-upload.component';

@Component({
  selector: 'app-transform',
  styleUrls: ['./transform.component.scss'],
  templateUrl: './transform.component.html' 
})
export class TransformComponent extends EffectComponent {
  @Input() element: ImageUploadElement;
  public effect: Transform;
  elementComponent: ImageUploadComponent;
  constrain = true;

  constructor(elementComponent: ImageUploadComponent) {
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

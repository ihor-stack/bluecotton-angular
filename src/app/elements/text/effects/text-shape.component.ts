import { Component, Input } from '@angular/core';
import { EffectComponent} from '../../effect.component';
import { TextElement } from '../text-element';
import { TextElementComponent } from '../text-element.component';
import { TextShape } from './text-shape';

@Component({
  selector: 'app-text-shape',
  styleUrls: ['./text-shape.component.scss'],
  templateUrl: './text-shape.component.html',
})
export class TextShapeComponent extends EffectComponent {
  @Input() element: TextElement;
  public effect: TextShape;
  public enabled = false;
  elementComponent: TextElementComponent;

  constructor(elementComponent: TextElementComponent) {
    super(elementComponent);
  }

  additionalOnInit() {
    if (this.element) {
      this.enabled = this.element.shapeName !== 'plain';
    }
  }

  adjustDisplay(): string {
    const displayAmount = this.element.shapeAdjust - 50;
    if (displayAmount > 0) {
      return '+' + displayAmount;
    }
    return displayAmount.toString();
  }

  onEnabledChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.enabled = target.checked;
    if (this.enabled) {
      this.element.shapeName = this.effect.shapes[0];
      this.element.shapeAdjust = 75;
    } else {
      this.element.shapeName = 'plain';
    }
    this.element.render().subscribe();
  }

  // overriding because we're manipulating element properties directly
  onEffectChanges(property: string, value: any) {
    switch (property) {
      case 'shapeType': {
        this.element.shapeName = value;
        break;
      }
      case 'shapeAdjust': {
        this.element.shapeAdjust = value;
        break;
      }
    }
    this.element.render().subscribe();
  }

  protected newEffect(): TextShape {
    return new TextShape();
  }

  protected effectClass(): string {
    return 'TextShape';
  }
}

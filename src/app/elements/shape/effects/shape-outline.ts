import { Color } from '../../../colors/color';
import { Effect, EffectBox } from '../../effect';
import { Element } from '../../../element';

export class ShapeOutline extends Effect {

  static newFromJson(json: object, element: Element): ShapeOutline {
    const effect = new ShapeOutline();
    effect.element = element;
    effect.fromJson(json);
    effect.color = Color.fromJson(effect.color);
    return effect;
  }

  constructor() {
    super();
    this.data['weight'] = 20;
    this.data['thickness'] = 30;
  }

  get thickness(): number { return this.data['thickness']; }
  set thickness(value: number) { this.data['thickness'] = value; }

  get color(): Color { return this.data['color']; }
  set color(value: Color) { this.data['color'] = value; }

  public buildEffect() {
    if (!this.enabled) {
      this.element.shapeSvgElement
        .attr({'stroke-width': 0})
      ;
      this.element.outline = 0;
    }
    if (this.enabled) {
      let outline = this.thickness/ 5.0;

      this.element.shapeSvgElement
        .attr({'stroke-width': outline})
        .stroke(this.color.rgb)
      ;
      switch (this.element.type) {
        case 'triangle' : outline *= 2;
         break;
        case 'star' : outline *= 2.5;
         break;
        default : 
        break;
      }

      this.element.outline = outline / 2;
    }
    return null;
  }

  boundingBox(): EffectBox {
    return null;
  }
  get className(): string {
    return 'ShapeOutline';
  }
}

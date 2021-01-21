import { Component, Input } from '@angular/core';
import { Color } from '../colors/color';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-color-swatch',
  styleUrls: ['./color-swatch.component.scss'],
  templateUrl: './color-swatch.component.html',
})
export class ColorSwatchComponent {
  @Input() color: Color;
  @Input() active = false;
  @Input() isShowHover = false;

  constructor(private sanitizer: DomSanitizer) {}

  getImageStyle(url) {
    return this.sanitizer.bypassSecurityTrustStyle('url("' + url + '")');
  }
}

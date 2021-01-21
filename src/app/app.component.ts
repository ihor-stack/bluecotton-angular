import { Component, ElementRef, Input, AfterContentInit, OnInit, OnDestroy } from '@angular/core';
import { AlertsService, Alert } from './ui/alerts.service';
import { AccountService } from './services/account.service'
import { ColorsService } from './colors/colors.service';
import { CookiesService } from './services/cookies.service';
import { Design } from './designs/design';
import { DesignsService } from './designs/designs.service';
import { DesignsEvent } from './designs/designs-event';
import { DialogService } from './ui/dialog.service';
import { environment } from '../environments/environment';
import { FontPickerService } from './ui/font-picker.service';
import { GlobalService } from './services/global.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { SvgService } from './services/svg.service';
import { Product } from './products/product';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterContentInit, OnInit, OnDestroy {
  title = 'SVG Designer';
  selectedDesign: Design;
  draw: any;
  toolbarName: string = '';
  disableToolbar: boolean = true;
  private designsSubscription: Subscription;
  private colorsSubscription: Subscription;
  public currentDesign: Design;
  @Input() designId: string;
  @Input() cartItemId: string;
  @Input() exportMode: string;
  @Input() spoofSession: string;
  @Input() orderId: string;
  @Input() itemId: string;
  @Input() sharedDesignId: string;
  @Input() productId: string;
  @Input() colorId: string;
  @Input() preview: boolean;

  constructor(
    private svgService: SvgService,
    private designsService: DesignsService,
    private colorsService: ColorsService,
    private dialogService: DialogService,
    private elementRef: ElementRef,
    private fontService: FontPickerService,
    private globalService: GlobalService,
    private accountService: AccountService,
    private alertsService: AlertsService,
    private route: ActivatedRoute
  ) {
    // get initial designId and cartItemId (if any) from root component to pass down to children
    globalService.designId = this.designId = this.elementRef.nativeElement.getAttribute('designId');
    globalService.cartItemId = this.cartItemId = this.elementRef.nativeElement.getAttribute('cartItemId');
    globalService.exportMode = this.exportMode = this.elementRef.nativeElement.getAttribute('exportMode');
    globalService.spoofSession = this.spoofSession = this.elementRef.nativeElement.getAttribute('spoofSession');
    globalService.orderId = this.orderId = this.elementRef.nativeElement.getAttribute('orderId');
    globalService.itemId = this.itemId = this.elementRef.nativeElement.getAttribute('itemId');
    globalService.sharedDesignId = this.sharedDesignId = this.elementRef.nativeElement.getAttribute('sharedDesignId');
    globalService.productId = this.productId = this.elementRef.nativeElement.getAttribute('productId');
    globalService.preview   = this.preview = this.elementRef.nativeElement.getAttribute('preview');

    this.colorId = this.elementRef.nativeElement.getAttribute('colorId');

    // Add environment config to window object so plain JS can access it
    window['environment'] = environment;
    window['spoofSession'] = this.spoofSession;
  }

  ngOnInit() {
    // Preload colors for convenience
    this.colorsSubscription = this.colorsService.getColors().subscribe((colors) => {
      this.colorsService.loadedColors = colors;
    });

    this.designsSubscription = this.designsService.selectedDesign.subscribe((design) => {
      this.currentDesign = design;
    });

    this.fontService.loadFonts([this.fontService.defaultFontFamily()]);

    this.accountService.getAccount().subscribe((account) => {});

    if (!environment.production) {
      this.designsService.events.subscribe((event) => {
        console.groupCollapsed(event.type);
        console.log(event.payload);
        console.groupEnd();
      });
      this.route.queryParams.subscribe(params => {
        this.globalService.cartItemId = params['cartItemId'];
      });
    }

    if (this.preview) {
      // this is bad but the alternative seems very difficult and time consuming
      window.onload = function(){
        const wrapper = document.getElementsByClassName('svg-wrapper')[0];
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '20';
        (wrapper as any).prepend(overlay);
      };
    }
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  ngAfterContentInit() {
    this.draw = this.svgService.draw();

    // TODO: where did 600/800 come from? Should it always be 600x800? or can it differ?
    this.draw.size('100%', '100%').viewbox(0, 0, 600, 800)
         .rect('100%', '100%').fill('#DDD').attr('opacity', '0.2');

    // when root svg is clicked, either select the element at those coords, or unselect everything
    const self = this;
    this.draw.node.addEventListener('click', function(e) {
      if (self.currentDesign && self.currentDesign.currentArea) {
        const element = self.currentDesign.currentArea.elementAt(e.clientX, e.clientY);
        if (element) {
          self.designsService.broadcastEvent(new DesignsEvent('SELECT_ELEMENT', element));
          element.select();
          return;
        }
      }
      self.draw.getSelected().selectify(false);
    });

    document.querySelector('body').addEventListener('click', function(e) {
      // only close group if target wasn't from inside a modal-dialog
      const target = e.target as HTMLElement;
      if (!self.hasParentWithClass(target, 'modal-dialog')) {
        self.dialogService.closeGroup('edit-element');
      }
    });

    window.onbeforeunload = function() {
      if (self.currentDesign.hasUnsavedChanges && environment.warnBeforeLeaving) {
        return 'Don\'t leave your work behind. Hit \'My Design\' and save your design for later.';
      }
    };
  }

  ngOnDestroy() {
    if (this.designsSubscription) {
      this.designsSubscription.unsubscribe();
    }
    if (this.colorsSubscription) {
      this.colorsSubscription.unsubscribe();
    }
  }

  previewMode(): boolean {
    return this.preview;
  }

  designHasBack(): boolean {
    return !!(this.currentDesign && this.currentDesign.activeSides.find(s => s.name === 'Back'));
  }

  showDetailToolbar(evt, toolbarName) {
    if (this.toolbarName === toolbarName) {
      this.disableToolbar = !this.disableToolbar;
    } else {
      this.disableToolbar = false;
      switch (toolbarName) {
        case 'design': {
          this.toolbarName = toolbarName;
          break;
        }
        case 'product': {
          this.toolbarName = toolbarName;
          let element: HTMLElement = document.getElementById('showQuickBar') as HTMLElement;
          element.click();
          break;
        }
        case 'share': {
          let element: HTMLElement = document.getElementById('openShare') as HTMLElement;
          element.click();
          this.toolbarName = toolbarName;
          break;
        }
        case 'save': {
          this.toolbarName = toolbarName;
          let element: HTMLElement = document.getElementById('showQuickBar') as HTMLElement;
          element.click();
          break;
        }
      }
    }
  }

  showQuickMobileBar(evt) {
    let element: HTMLElement = document.getElementById('showQuickMobileBar') as HTMLElement;
    element.click();
  }

  openProducts(event: Event) {
    let element: HTMLElement = document.getElementById('openProduct') as HTMLElement;
    element.click();
  }

  openColorsEditor(event: Event) {
    const element1: HTMLElement = document.getElementById('openColorsEditor') as HTMLElement;
    const elements2: any = document.getElementsByClassName('multi-color-swatch');
    if (element1) {
      element1.click();
    } else {
      if (elements2.length > 0) {
        elements2[0].click();
      }
    }
  }

  openQuantities(event: Event) {
    let element: HTMLElement = document.getElementById('openQuantities') as HTMLElement;
    element.click();
  }

  onShareViaFacebook(event: Event) {
    let element: HTMLElement = document.getElementById('onShareViaFacebook') as HTMLElement;
    element.click();
  }

  onShareViaTwitter(event: Event) {
    let element: HTMLElement = document.getElementById('onShareViaTwitter') as HTMLElement;
    element.click();
  }

  onShareViaEmail(event: Event) {
    let element: HTMLElement = document.getElementById('onShareViaEmail') as HTMLElement;
    element.click();
  }

  saveNew(event: Event) {
    let element: HTMLElement = document.getElementById('openSave') as HTMLElement;
    element.click();
  }

  saveExistingOne(event: Event) {
    let element: HTMLElement = document.getElementById('saveExistingOne') as HTMLElement;
    element.click();
  }

  onSwitchSides(event: Event) {
    let element: HTMLElement = document.getElementById('switchSides') as HTMLElement;
    element.click();
  }

  private hasParentWithClass(el: HTMLElement, className: string) {
    if (!el) {
      return false;
    }

    if (el.classList && el.classList.contains(className)) {
      return true;
    }
    return el.parentNode && this.hasParentWithClass(el.parentNode as HTMLElement, className);
  }
}

import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Design } from '../designs/design';
import { DesignsService } from '../designs/designs.service';
import { DesignsEvent } from '../designs/designs-event';
import { DialogService } from '../ui/dialog.service';
import { PricingService, PricingLineItem } from '../pricing/pricing.service';
import { SizesComponent } from './sizes.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-pricing',
  styleUrls: ['./pricing.component.scss'],
  templateUrl: './pricing.component.html',
})
export class PricingComponent implements OnInit, OnDestroy {
  private currentDesign: Design;
  private eventsSubscription: Subscription;
  private subscription: Subscription;
  public pricingLineItems: PricingLineItem[] = [];
  public price = '';
  private pricingSubscription: Subscription;
  @ViewChild(SizesComponent) sizesComponent: SizesComponent;
  @ViewChild('content') pricingPopup: TemplateRef<any>;

  constructor(private designsService: DesignsService, private dialogService: DialogService, private pricingService: PricingService) {}

  ngOnInit() {
    this.subscription = this.designsService.selectedDesign.subscribe((d) => {
      this.currentDesign = d;
    });

    this.pricingSubscription = this.pricingService.lineItems.subscribe((lineItems) => {
      this.pricingLineItems = lineItems;
      if (lineItems) {
        const total = lineItems.find((li) => li.label === 'Total');
        if (total) {
          this.price = total.value;
        }
      }
    });

    this.eventsSubscription = this.designsService.events.subscribe((designEvent: DesignsEvent) => {
      switch (designEvent.type) {
        case 'LOAD_DESIGN':
        case 'UPDATE_DESIGN':
        case 'CHANGE_DESIGN_PRODUCT':
        case 'CHANGE_PRODUCT_COLOR':
          this.pricingService.getPricing(designEvent.payload);
          break;

        case 'ADD_ELEMENT':
        // TODO: This event probably shouldn't exist.. the payload needs to have this flag
        case 'UPDATE_ELEMENT_LIKELY_PRICE_CHANGE':
        case 'REMOVE_ELEMENT':
          this.pricingService.getPricing(this.currentDesign);
          break;
      }
    });
  }

  zeroPrice() {
    return this.price === '$0.00';
  }

  open() {
    this.dialogService.open(this.pricingPopup, { name: 'pricing', size: 'lg'});
  }

  addQuantities() {
    this.sizesComponent.open();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.pricingSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
  }
}

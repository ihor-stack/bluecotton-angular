import { AccountService } from '../services/account.service';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Design } from './design';
import { DesignsService } from './designs.service';
import { DialogService } from '../ui/dialog.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-design-add-to-cart',
  styleUrls: ['./add-to-cart.component.scss'],
  templateUrl: './add-to-cart.component.html'
})

export class AddToCartComponent {
  @Input() currentDesign: Design;
  @ViewChild('cartPopup') cartPopup: TemplateRef<any>;

  constructor(
    private designsService: DesignsService,
    private dialogService: DialogService,
    private globalService: GlobalService,
    private accountService: AccountService
  ) {}

  onChanges(property: string, value: any) {
    switch (property) {
      case 'specialInstructions':
        this.currentDesign.specialInstructions = value.target.value;
        break;
    }
  }

  isLoggedIn() {
    if (this.accountService.account['id']) {
      return true;
    } else {
      return false;
    }
  }

  openAddToCart() {
    this.dialogService.open(this.cartPopup, { name: 'design-cart', size: 'lg' });
  }

  onAddToCart() {
    this.designsService.addToCart(this.currentDesign);
  }

  onAddToCartOverride() {
    this.designsService.addToCart(this.currentDesign, this.globalService.cartItemId);
  }

  overridePossible() {
    return this.globalService.cartItemId !== null && this.globalService.productId === null;
  }
}


import { AccountService } from '../services/account.service';
import { AlertsService, Alert } from '../ui/alerts.service';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Design } from './design';
import { DesignsService } from './designs.service';
import { DialogService, DialogRef } from '../ui/dialog.service';

@Component({
  selector: 'app-design-save',
  styleUrls: ['./save.component.scss'],
  templateUrl: './save.component.html'
})
export class SaveComponent {
  @Input() currentDesign: Design;
  private saveDialog: DialogRef;
  @ViewChild('savePopup') savePopup: TemplateRef<any>;
  private promotionalEmails: boolean;
  private clicked = false;

  constructor(
    private designsService: DesignsService,
    private dialogService: DialogService,
    private alertsService: AlertsService,
    private accountService: AccountService,
  ) {
    this.promotionalEmails = true;
  }

  onChanges(property: string, value: any) {
    switch (property) {
      case 'name':
        this.currentDesign.name = value;
        break;
    }
  }

  openSave() {
    this.saveDialog = this.dialogService.open(this.savePopup, { name: 'design-save', size: 'lg' });
  }

  onSave(overwrite = false) {
    if (!overwrite) {
      this.currentDesign.resetId();
    }
    let self = this;
    this.designsService.saveDesign(this.currentDesign).subscribe((id) => {
      const alert = this.alertsService.broadcast(new Alert({content: 'Design saved successfully!', dismissIn: 3}));

      if (this.promotionalEmails) {
        this.accountService.subscribeToPromotionalEmails().subscribe((res) => {
        });
      }

      this.dialogService.close(this.saveDialog);
      self.clicked = false;
    },
    (error) => {
      self.clicked = false;
    });
  }

  isLoggedIn() {
    if (this.accountService.account['id']) {
      return true;
    } else {
      return false;
    }
  }

  hasServerSave() {
    return this.currentDesign.hasServerSave();
  }

  accountEventsHandler(event) {
    switch (event) {
      case 'close':
        this.dialogService.close(this.saveDialog);
        break;
    }
  }
}


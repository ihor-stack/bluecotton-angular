import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Design } from './design';
import { DesignsService } from './designs.service';
import { DialogService } from '../ui/dialog.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-design-share',
  styleUrls: ['./share.component.scss'],
  templateUrl: './share.component.html'
})
export class ShareComponent {
  @Input() currentDesign: Design;
  @Input() sharedDesignId: string;
  @ViewChild('sharePopup') sharePopup: TemplateRef<any>;

  constructor(
    private designsService: DesignsService,
    private dialogService: DialogService,
  ) {}

  onChanges(property: string, value: any) {
    switch (property) {
      case 'name':
        this.currentDesign.name = value;
        break;
    }
  }

  openShare() {
    if (!this.shouldShowShareLinks()) {
      this.designsService.shareDesign(this.currentDesign).subscribe((id) => {
        this.sharedDesignId = id;
      });
    }
    if (window.innerWidth <= 890) {
      this.dialogService.open(this.sharePopup, { name: 'design-share', classes: 'not-visible' });
    } else {
      this.dialogService.open(this.sharePopup, { name: 'design-share', size: 'xx', class: 'lg' });
    }
  }

  onShare() {
    this.designsService.saveDesign(this.currentDesign).subscribe();
  }

  shareDesignLink() {
    return 'https://bluecotton.com/share/load?id=' + this.sharedDesignId;
  }

  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  shouldShowShareLinks() {
    return this.sharedDesignId && !this.currentDesign.hasUnsavedChanges;
  }

  onShareViaEmail() {
    window.open(environment.siteUrl + '/share/redirect?method=email&shareID=' + this.sharedDesignId);
  }

  onShareViaFacebook() {
    window.open(environment.siteUrl + '/share/redirect?method=facebook&shareID=' + this.sharedDesignId);
  }

  onShareViaTwitter() {
    window.open(environment.siteUrl + '/share/redirect?method=twitter&shareID=' + this.sharedDesignId);
  }
}


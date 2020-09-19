import { Component, OnInit } from '@angular/core';
import { PaginasService } from 'src/app/menu/paginas.service';
import { Page } from 'src/app/menu/page.model';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-settings-popover',
  templateUrl: './settings-popover.component.html',
  styleUrls: ['./settings-popover.component.scss'],
})
export class SettingsPopoverComponent implements OnInit {

  thePage: Page;

  constructor(private popoverController: PopoverController, private paginasService: PaginasService) {
    this.paginasService.getObjects().then(_ => {
      this.thePage = this.paginasService.getThePage();
    }); }

  ngOnInit() {
  }

  setPlayPage(event) {
    this.paginasService.setPlayPage(event.detail.checked);
  }

  setSpeech(event) {
    this.paginasService.setSpeech(event.detail.checked);
  }

  deletePage() {
    this.paginasService.deletePage(this.thePage.id);
    this.dismissClick();
  }

  async dismissClick() {
    await this.popoverController.dismiss();
  }


}

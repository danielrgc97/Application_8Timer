import { Component, OnInit } from '@angular/core';
import { PaginasService } from 'src/app/menu/paginas.service';
import { Page } from 'src/app/menu/page.model';

@Component({
  selector: 'app-settings-popover',
  templateUrl: './settings-popover.component.html',
  styleUrls: ['./settings-popover.component.scss'],
})
export class SettingsPopoverComponent implements OnInit {

  thePage: Page;

  constructor(private paginasService: PaginasService) {
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

  retu(){
    return this.paginasService.getThePage().playpage;
  }


}

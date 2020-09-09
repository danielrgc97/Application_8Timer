import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Page } from './page.model';
import { PaginasService } from './paginas.service';

import { AlertController } from '@ionic/angular';
import { MainTimersPage } from '../main-timers/main-timers.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  paginas: Page[];


  constructor( public alertController: AlertController, private router: Router, private paginasService: PaginasService) {}

  ngOnInit( ) {
    this.paginasService.getObjects().then( _ => {
      this.paginas = this.paginasService.getAllPages();
    });
  }

  addPage(name: string) {
    this.paginas.push({
      id: this.paginas.length,
      name,
      playpage: false,
      speech: false
    });

    this.paginasService.volcarPages(this.paginas);
  }

  async createPageAlert(){
    const alert = await this.alertController.create({
      header: 'Creating a timer',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Create',
          handler: (data) => {
            this.addPage(data.name);
          }
        }
      ]
    });

    await alert.present();
  }


  pageSelected(id: number) {
    this.paginasService.setThePage(id);
    this.paginasService.ngOnInitEventEmit();
  }


}

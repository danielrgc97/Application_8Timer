import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Page } from './page.model';
import { PaginasService } from './paginas.service';

import { AlertController } from '@ionic/angular';
import { MainTimersPage } from '../main-timers/main-timers.page';
import { CajasService } from '../main-timers/cajas.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  paginas: Page[];
  thePageId: number;


  constructor( public alertController: AlertController, private router: Router,
               private paginasService: PaginasService, private cajasService: CajasService) {}

  ngOnInit( ) {
    // if (this.paginasService.subsVar === undefined) {
    //   this.paginasService.subsVar = this.paginasService.
    //   invokeNgOnInit.subscribe((name: string) => {
    //     this.ngOnInit();
    //   });
    // }

    this.paginasService.getObjects().then( _ => {
      this.paginas = this.paginasService.getAllPages();
      this.thePageId = this.paginasService.getThePage().id;
    });
  }

  addPage(name: string) {
    const newId = this.paginas.length;
    this.paginas.push({
      id: newId,
      name,
      playpage: false,
      speech: false
    });
    this.paginasService.setThePage(newId);
    this.paginasService.volcarPages(this.paginas);
    this.ngOnInit();
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
            if (data.name === ''){
            } else {
              this.addPage(data.name);
            }
          }
        }
      ]
    });

    await alert.present();
  }


  pageSelected(id: number) {
    this.paginasService.setThePage(id);
    this.ngOnInit();
  }


}

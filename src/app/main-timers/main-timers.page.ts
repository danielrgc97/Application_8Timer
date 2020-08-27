import { Component, OnInit } from '@angular/core';
import { Caja } from './caja.model';
import { CajasService } from './cajas.service';
import { AlertController } from '@ionic/angular';

import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';

const { Storage } = Plugins;

const { Filesystem } = Plugins;


@Component({
  selector: 'app-main-timers',
  templateUrl: './main-timers.page.html',
  styleUrls: ['./main-timers.page.scss'],
})
export class MainTimersPage implements OnInit {
  cajas: Caja[];
  json = [];

  constructor( private cajasService: CajasService, public alertController: AlertController) {}

  ngOnInit() {
    this.cajasService.getObjects().then( _ => {
    this.cajas = this.cajasService.getAllCajas();
    });
  }

  a(){
  }

  async createCaja(){
      const alert = await this.alertController.create({
        header: 'Create new Timer',
        message: 'Insert the value of the timer in seconds',
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: 'MyTimerName'
          },
          {
            name: 'time',
            type: 'number',
            placeholder: '15'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Create',
            handler: (data) => {
              this.cajasService.addCaja(data.name, data.time);
              this.ngOnInit();
            }
          }
        ]
      });

      await alert.present();
  }

  

}

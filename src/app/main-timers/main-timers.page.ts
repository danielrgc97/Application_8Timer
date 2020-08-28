import { Component, OnInit } from '@angular/core';
import { Caja } from './caja.model';
import { CajasService } from './cajas.service';
import { AlertController } from '@ionic/angular';

import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';

@Component({
  selector: 'app-main-timers',
  templateUrl: './main-timers.page.html',
  styleUrls: ['./main-timers.page.scss'],
})
export class MainTimersPage implements OnInit {

  cajas: Caja[];

  constructor( public alertController: AlertController, private cajasService: CajasService) {}

  ngOnInit() {
    this.cajasService.getObjects().then( _ => {
      this.cajas = this.cajasService.getAllCajas();
    });
  }

  async createCajaAlert(){
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
              this.cajasService.addCaja(data.name, parseInt(data.time, 10));
              this.ngOnInit();
            }
          }
        ]
      });

      await alert.present();
  }

  playpauseButton(id: number){
    if ( this.cajas[id].counting === true ){
      this.pause(id);
    } else{
      this.play(id);
    }
  }

  play(id: number){
    this.cajas[id].counting = true;
    this.cajas[id].interval = setInterval(() => {
      --this.cajas[id].countingValue;
      if ( this.cajas[id].countingValue < 0){
        this.cajas[id].countingValue = this.cajas[id].timerValue;
        this.playpauseButton(id);
      }
    }, 1000);
  }
  pause(id: number){
    clearInterval(this.cajas[id].interval);
    this.cajas[id].counting = false;
  }

  resetButton(id: number){
    this.cajas[id].countingValue = this.cajas[id].timerValue;
    this.pause(id);
  }

  deleteButton (id: number){
    this.cajasService.deleteCaja(id);
    this.cajas = this.cajasService.getAllCajas();
  }





}

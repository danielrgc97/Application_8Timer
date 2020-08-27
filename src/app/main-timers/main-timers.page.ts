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
  timeLeft: number = 60;
  interval;

  constructor( public alertController: AlertController, private cajasService: CajasService) {}

  ngOnInit() {
    this.cajasService.getObjects().then( _ => {
      this.cajas = this.cajasService.getAllCajas();
    }).then( _ => {
      setInterval(() => {
        for (const i of this.cajas){
          if ( i.counting === true ){
            i.countingValue--;
          }
        }
      }, 1000);
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

  a(){
    this.cajas[0].counting = true;
  }

  seconds() {
    if ( this.cajas != null ){
    this.cajas[0].countingValue--;
    }
    console.log(this.cajas);
  }

startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }




}

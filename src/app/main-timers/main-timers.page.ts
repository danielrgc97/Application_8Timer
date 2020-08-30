import { Component, OnInit } from '@angular/core';
import { Caja } from './caja.model';
import { CajasService } from './cajas.service';
import { AlertController } from '@ionic/angular';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

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

  // Alerts

  async createCajaAlert(){
      const alert = await this.alertController.create({
        header: 'Create new Timer',
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: 'Name of the timer'
          },
          {
            name: 'time',
            type: 'number',
            placeholder: 'Seconds: 15, 100...'
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
              if ( data.name === "" || data.time === "" ){
                this.createCajaAlert();
              }else{
                this.cajasService.addCaja(data.name, parseInt(data.time, 10));
                this.ngOnInit();
              }
            }
          }
        ]
      });

      await alert.present();
  }

  async editCajaAlert(id: number){
    const alert = await this.alertController.create({
      header: 'Configure',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: this.cajas[id].nombre
        },
        {
          name: 'time',
          type: 'number',
          value: this.cajas[id].timerValue
        }
      ],
      buttons: [
        {
          text: 'Delete',
          handler: (data) => {
            this.cajasService.deleteCaja(id);
            this.ngOnInit();
          }
        },
        {
          text: 'Edit',
          handler: (data) => {
            console.log(data.number);
            if ( data.name === "" || data.time === "" ){
              this.editCajaAlert(id);
            }else{
              this.cajasService.editCaja(id, data.name, parseInt(data.time, 10));
              this.cajasService.setObjects();
              this.cajas[id].countingValue = data.time;
              this.ngOnInit();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Buttons

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
        this.resetButton(id);
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

  // Drag and drop

  drop(event: CdkDragDrop<string[]>) {
    // moveItemInArray(this.cajas, event.previousIndex, event.currentIndex);
  }



}

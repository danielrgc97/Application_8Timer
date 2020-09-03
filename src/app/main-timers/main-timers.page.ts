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
  showGroup = true;

  constructor( public alertController: AlertController, private cajasService: CajasService) {}

  ngOnInit() {
    this.cajasService.getObjects().then( _ => {
      this.cajas = this.cajasService.getAllCajas();
    }).then(_ => {
      for (const c of this.cajas){
        this.displayStringFormer(c.id);
      }
    });
  }

  // Alerts
  async createCajaTimerAlert(){
    const alert = await this.alertController.create({
      header: 'Creating a timer',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name of the timer '
        },
        {
          name: 'hours',
          type: 'number',
          placeholder: 'Number of hours ( 0 - 9 )'
        },
        {
          name: 'minutes',
          type: 'number',
          placeholder: 'Number of minutes ( 0 - 59 )'
        },
        {
          name: 'seconds',
          type: 'number',
          placeholder: 'Number of seconds ( 0 - 59 )'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (data) => {
            if ( data.name === '' || (data.hours === '' && data.minutes === '' && data.seconds === '' ) ) {
              this.createCajaTimerAlert();
              this.basicAlert('A timer must have at least a name and a time field');
            } else if ((data.hours > 9 || data.hours < 0) || (data.minutes > 59 || data.minutes < 0) ||
             (data.seconds > 59 || data.seconds < 0) ) {
              this.createCajaTimerAlert();
              this.basicAlert('Introduce allowed values');
            } else {
              let totalTimeValue =  data.hours * 3600 + data.minutes * 60 + 1 * data.seconds;
              if (totalTimeValue === 0){ totalTimeValue = 1; }
              this.addCaja( 'timer', 0, data.name, totalTimeValue, null, null);
              this.ngOnInit();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async editCajaTimerAlert(id: number){
    const alert = await this.alertController.create({
      header: 'Set the timer',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name : ' + this.cajas[id].timerName
        },
        {
          name: 'seconds',
          type: 'number',
          placeholder: 'Seconds : ' + Math.floor(this.cajas[id].timerValue % 3600 % 60)
        },
        {
          name: 'minutes',
          type: 'number',
          placeholder: 'Minutes : ' + Math.floor(this.cajas[id].timerValue % 3600 / 60)
        },
        {
          name: 'hours',
          type: 'number',
          placeholder: 'Hours : ' + Math.floor(this.cajas[id].timerValue / 3600 )
        }
      ],
      buttons: [
        {
          text: 'Delete',
          handler: (data) => {
            this.deleteCaja(id);
            this.ngOnInit();
          }
        },
        {
          text: 'Confirm',
          handler: (data) => {
            if ((data.hours > 9 || data.hours < 0) || (data.minutes > 59 || data.minutes < 0) ||
             (data.seconds > 59 || data.seconds < 0) ) {
              this.editCajaTimerAlert(id);
              this.basicAlert('Introduce allowed values');
            } else {
              let h = Math.floor(this.cajas[id].timerValue / 3600 );
              let m = Math.floor(this.cajas[id].timerValue % 3600 / 60);
              let s = Math.floor(this.cajas[id].timerValue % 3600 % 60);

              if ( data.name !== null ) { this.cajas[id].timerName = data.name; }
              if ( data.hours !== '' ) { h = data.hours; }
              if ( data.minutes !== '' ) { m = data.minutes; }
              if ( data.seconds !== '' ) { s = data.seconds; }

              const totalTimeValue =  h * 3600 + m * 60 + 1 * s;
              this.cajas[id].timerValue = totalTimeValue;
              this.cajas[id].countingValue = totalTimeValue;
              this.displayStringFormer(id);
              this.cajasService.volcarCajas(this.cajas);
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async createCajaCircuitAlert(){
    const alert = await this.alertController.create({
      header: 'Creating new circuit',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name of the circuit'
        },
        {
          name: 'laps',
          type: 'number',
          placeholder: 'Laps of the circuit ( 0 - 999 )'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (data) => {
            if ( data.name === '' || data.laps === '' ){
              this.createCajaCircuitAlert();
              this.basicAlert('A circuit must have name and laps');
            }else{
              this.addCaja('circuit', 11, null, null, data.name, parseInt(data.laps, 10));
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async editCajaCircuitAlert(id: number){
    const alert = await this.alertController.create({
      header: 'Set the circuit',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Current name : ' + this.cajas[id].circuitName
        },
        {
          name: 'laps',
          type: 'number',
          placeholder: 'Current name : ' + this.cajas[id].circuitLaps
        }
      ],
      buttons: [
        {
          text: 'Delete',
          handler: (data) => {
            this.deleteCaja(id);
            this.ngOnInit();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (data) => {
            if (data.laps > 999 || data.laps < 0){
              this.editCajaCircuitAlert(id);
              this.basicAlert('Introduce allowed values');
            }else{
              if ( data.name !== '' ) { this.cajas[id].circuitName = data.name; }
              if ( data.laps !== '' ) { this.cajas[id].circuitLaps = data.laps; }
              this.cajasService.volcarCajas(this.cajas);
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async basicAlert(message: string){

    const alert = await this.alertController.create({
      header: message,
      buttons: [
        {
          text: 'Accept',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  // Timer controls
  playpause(id: number){
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
      this.displayStringFormer(id);
      if ( this.cajas[id].countingValue < 0){
        this.reset(id);
      }
    }, 1000);
  }
  pause(id: number){
    clearInterval(this.cajas[id].interval);
    this.cajas[id].counting = false;
    this.cajasService.volcarCajas(this.cajas);
  }
  reset(id: number){
    this.cajas[id].countingValue = this.cajas[id].timerValue;
    this.displayStringFormer(id);
    this.pause(id);
  }

  // Caja controls
  addCaja(type: string, circuitState: number, timerName: string, timerValue: number, circuitName: string, circuitLaps: number){
    this.cajas.push({
      type,
      enabled: true,
      circuitState,
      id: this.cajas.length,
      timerName,
      timerValue,
      countingValue: timerValue,
      displayString: null,
      counting: false,
      interval: null,
      circuitName,
      circuitLaps
    });
    this.cajasService.volcarCajas(this.cajas);
  }
  deleteCaja(id: number){
    this.cajas.splice( id, 1);
    this.orderIds();
    this.cajasService.volcarCajas(this.cajas);
  }
  orderIds(){
    let i = 0;
    for (const c of this.cajas){
      c.id = i++;
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    this.moveCajas(event.previousIndex, event.currentIndex);
  }
  moveCajas(fromId: number, toId: number) {
    const tempCaja = this.cajas[fromId];
    if (fromId < toId){
      for (let i = fromId; i < toId; i++){
        this.cajas[i] = this.cajas[i + 1];
        this.cajas[i].id = i;
      }
    } else {
      for (let i = fromId; i > toId; i--){
        this.cajas[i] = this.cajas[i - 1];
        this.cajas[i].id = i;
      }
    }
    this.cajas[toId] = tempCaja;
    this.cajas[toId].id = toId;
    this.cajasService.volcarCajas(this.cajas);
  }
  displayStringFormer(id: number){
    if (this.cajas[id].countingValue !== null){
      const h = Math.floor(this.cajas[id].countingValue / 3600 );
      const m = Math.floor(this.cajas[id].countingValue % 3600 / 60);
      const s = Math.floor(this.cajas[id].countingValue % 3600 % 60);

      let mm = '';
      let ss = '';
      if ( s < 10 ) { ss = '0' + s; } else { ss = '' + s; }
      if ( m < 10 ) { mm = '0' + m; } else { mm = '' + m; }

      this.cajas[id].displayString = h + ':' + mm + ':' + ss;
    }
  }

  // Circuit control
  flechaChange(id: number){
    if (this.cajas[id].circuitState === 11) {
      this.changeCircuitState(id, 10);
      this.ngOnInit();
    } else {
      this.changeCircuitState(id, 11);
      this.ngOnInit();
    }
  }
  changeCircuitState(id: number, num: number){
    this.cajas[id].circuitState = num;
    this.cajasService.volcarCajas(this.cajas);
  }
}

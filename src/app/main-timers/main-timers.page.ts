import { Component, OnInit } from '@angular/core';
import { Caja } from './caja.model';
import { CajasService } from './cajas.service';
import { AlertController } from '@ionic/angular';
import {CdkDragDrop, CdkDragMove} from '@angular/cdk/drag-drop';

import {Howl, Howler} from 'howler';


@Component({
  selector: 'app-main-timers',
  templateUrl: './main-timers.page.html',
  styleUrls: ['./main-timers.page.scss'],
})
export class MainTimersPage implements OnInit {

  cajas: Caja[];
  playPage = false;

  constructor( public alertController: AlertController, private cajasService: CajasService) {}

  ngOnInit() {
    this.cajasService.getObjects().then( _ => {
      this.cajas = this.cajasService.getAllCajas();
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
          placeholder: 'Name'
        },
        {
          name: 'seconds',
          type: 'number',
          placeholder: 'Seconds ( 0 - 59 )'
        },
        {
          name: 'minutes',
          type: 'number',
          placeholder: 'Minutes ( 0 - 59 )'
        },
        {
          name: 'hours',
          type: 'number',
          placeholder: 'Hours ( 0 - 9 )'
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
              this.addCaja( 'timer', data.name, totalTimeValue, null, null);
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

              if ( data.name !== '' ) { this.cajas[id].timerName = data.name; }
              if ( data.hours !== '' ) { h = data.hours; }
              if ( data.minutes !== '' ) { m = data.minutes; }
              if ( data.seconds !== '' ) { s = data.seconds; }

              const totalTimeValue =  h * 3600 + m * 60 + 1 * s;
              this.cajas[id].timerValue = totalTimeValue;
              this.cajas[id].countingValue = totalTimeValue;
              // this.displayStringFormer(id);
              this.magic();
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
          placeholder: 'Number of laps'
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
            }else if ( data.laps > 99 || data.laps < 1 ){
              this.createCajaCircuitAlert();
              this.basicAlert('Insert correctly values');
            } else {
              this.addCaja('circuit', null, null, data.name, parseInt(data.laps, 10));
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
          placeholder: 'Name : ' + this.cajas[id].circuitName
        },
        {
          name: 'laps',
          type: 'number',
          placeholder: 'Laps : ' + this.cajas[id].circuitLaps
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
            if (data.laps > 999 || data.laps < 0){
              this.editCajaCircuitAlert(id);
              this.basicAlert('Introduce allowed values');
            }else{
              if ( data.name !== '' ) { this.cajas[id].circuitName = data.name; }
              if ( data.laps !== '' ) { this.cajas[id].circuitLaps = data.laps; }
              this.magic();
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
    const sound = new Howl({
      src: ['../../assets/beeps/beep-30b.mp3']
    });

    this.cajas[id].counting = true;
    --this.cajas[id].countingValue;
    this.displayStringFormer(id);
    this.cajas[id].interval = setInterval(() => {
      --this.cajas[id].countingValue;
      this.displayStringFormer(id);
      if ( this.cajas[id].countingValue < 0){
        this.controller(id, 0);
        sound.play();
      }
    }, 1000);
  }
  pause(id: number){
    clearInterval(this.cajas[id].interval);
    this.cajas[id].counting = false;
    this.magic();
  }
  reset(id: number){
    this.cajas[id].countingValue = this.cajas[id].timerValue;
    this.displayStringFormer(id);
    this.pause(id);
  }

  // Caja controls
  addCaja(type: string, timerName: string, timerValue: number, circuitName: string, circuitLaps: number){
    let cSte = 5;
    if (type === 'circuit') {cSte = 11; }
    let c;
    let gId;
    if ( this.cajas.length !== 0) {
      c = this.cajas[this.cajas.length - 1];
      if (type === 'timer' && c.circuitState !== 0 && c.circuitState !== 10 && c.type !== 'timerHide' ) {
        gId = c.groupId; cSte = 1;
      } else {
        gId = c.groupId + 1;
      }
    } else {
      gId = 0;
    }
    this.cajas.push({
      type,
      groupId: gId,
      display: true,
      enabled: true,
      circuitState: cSte,
      id: this.cajas.length,
      timerName,
      timerValue,
      countingValue: timerValue,
      displayString: null,
      counting: false,
      interval: null,
      circuitPos: 0,
      circuitName,
      circuitDoingLap: 1,
      circuitLaps,
      visible: true
    });
    this.magic();
  }
  deleteCaja(id: number){
    this.cajas.splice( id, 1);
    this.magic();
  }
  drop(event: CdkDragDrop<string[]>) {
    if (this.cajas[event.previousIndex].type === 'timer') {
      this.moveCajas(event.previousIndex, event.currentIndex);

      if ( event.currentIndex > 0 ) {
        const a = this.cajas[event.currentIndex - 1];
        if (a.circuitState === 3 || a.circuitState === 2 || a.circuitState === 1 || a.circuitState === 11) {
         this.cajas[event.currentIndex].groupId = a.groupId;
        } else {
          this.cajas[event.currentIndex].groupId = 999;
        }
      } else {
        this.cajas[event.currentIndex].groupId = 999;
      }

    } else {
      if (event.previousIndex > event.currentIndex) {
        let posToMove = event.currentIndex;
        const cajasToMove = this.cajas.filter( caja => caja.groupId === this.cajas[event.previousIndex].groupId);
        for (const c of cajasToMove) {
          this.moveCajas( c.id, posToMove++);
        }
      } else {
        const numberOfCajasToMove = this.cajas.filter( caja => caja.groupId === this.cajas[event.previousIndex].groupId).length;
        for (let i = 0; i < numberOfCajasToMove; i++) {
          this.moveCajas( event.previousIndex, event.currentIndex);
        }
      }
    }
    this.magic();
  }
  drag(id: number) {
    if (this.cajas[id].circuitState === 11) {this.circuitHideShow(id); }
  }
  moveCajas(fromId: number, toId: number) {
    const tempCaja = this.cajas[fromId];
    if (fromId < toId){
      for (let i = fromId; i < toId; i++){
        this.cajas[i] = this.cajas[i + 1];
        // this.cajas[i].id = i;
      }
    } else {
      for (let i = fromId; i > toId; i--){
        this.cajas[i] = this.cajas[i - 1];
        // this.cajas[i].id = i;
      }
    }
    this.cajas[toId] = tempCaja;
    // this.cajas[toId].id = toId;
    // this.orderEverythingAndSave();
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

      if ( h === 0 ) {
        this.cajas[id].displayString = m + ':' + ss;
      } else {
        this.cajas[id].displayString = h + ':' + mm + ':' + ss;
      }
      // this.magic();

    }
  }

  // Circuit control
  circuitHideShow(id: number){
    if (this.cajas[id].circuitState === 11) {
      this.changeCircuitState(id, 10);
      const cajasToHide = this.cajas.filter(caja => caja.groupId === this.cajas[id].groupId && caja.type === 'timer');
      for ( const c of cajasToHide) {
        this.cajas[c.id].type = 'timerHide';
      }
    } else {
      this.changeCircuitState(id, 11);
      const cajasToShow = this.cajas.filter(caja => caja.groupId === this.cajas[id].groupId && caja.type === 'timerHide');
      for ( const c of cajasToShow) {
        this.cajas[c.id].type = 'timer';
      }
    }
    this.magic();
  }
  changeCircuitState(id: number, num: number){
    this.cajas[id].circuitState = num;
    this.magic();
  }
  magic(){ // Ordena ids, ajusta los estadados, ajusta display y guarda en memoria

    // Ordena campo id forma string y guarda circuitos con estado cerrado (10)
    let i = 0;
    for (const c of this.cajas){
      c.id = i++;
    }
    for (const c of this.cajas){
      this.displayStringFormer(c.id);
    }
    const closedCircuits = this.cajas.filter( caja => caja.circuitState === 10 );

    // Ordena campo groupId
    let oldGroup;
    let newGroupId = -1;
    for (const c of this.cajas){
      if (c.groupId === oldGroup){

      }else{
        newGroupId++;
      }
      oldGroup = c.groupId;
      c.groupId = newGroupId;
    }

    // Ordena circuit state and circuit position
    if (this.cajas.length > 0) {
      for (i = 0; i <= this.cajas[this.cajas.length - 1].groupId; i++) {
        let tam = 0;
        let posF = 0;
        let cPos = 0;
        for (const c of this.cajas) {
          if (c.groupId === i) { tam++; posF = c.id; this.cajas[c.id].circuitPos = ++cPos; }
        }
        const posI = posF - tam + 1;
        if ( tam > 1 ){
          for ( let j = posI; j <= posF; j++) {
            this.cajas[j].circuitState = 2;
          }
          this.cajas[posI].circuitState = 11;
          this.cajas[posI + 1].circuitState = 1;
          this.cajas[posF].circuitState = 3;
        } else {
          if (this.cajas[posF].type === 'circuit') {
            this.cajas[posF].circuitState = 11;
          } else {
            this.cajas[posF].circuitState = 0;
          }
        }
        for (const c of closedCircuits){
          this.cajas[c.id].circuitState = 10;
        }
      }
    }

    this.cajasService.volcarCajas(this.cajas);
    // orderEverythingAndSave
  }

  controller(id: number, flag: number) { // Es llapada al empezar y acabar un timer
    if ( flag === 1 ) {

      if ( this.cajas[id].counting === true ){
        this.pause(id);
      } else{
        if (this.playPage === true) {
          for (const c of this.cajas) {
            this.reset(c.id);
          }
        }
        const timersToReset = this.cajas.filter(caja => caja.groupId === this.cajas[id].groupId);
        for (const t of timersToReset) {
          this.reset(t.id);
        }
        this.play(id);
      }

    } else {
      this.reset(id);
      const timer = this.cajas[id];
      const circuit = this.cajas[this.cajas.findIndex(caja => caja.groupId === timer.groupId)];

      let idToPlay = id + 1;
      if (timer.circuitState === 0) { idToPlay = -1; }

      if (timer.circuitState === 3 && circuit.circuitDoingLap === circuit.circuitLaps) {
        idToPlay = -1;
        this.cajas[circuit.id].circuitDoingLap = 1;
      } else if (timer.circuitState === 3) {
        idToPlay = circuit.id + 1;
        ++this.cajas[circuit.id].circuitDoingLap;
      }

      if (idToPlay === -1) {

      } else {
        this.play(idToPlay);
      }
    }
  }

}

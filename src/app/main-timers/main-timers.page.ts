import { Component, OnInit } from '@angular/core';
import { Caja } from './caja.model';
import { CajasService } from './cajas.service';
import { AlertController, PopoverController } from '@ionic/angular';
import {CdkDragDrop, CdkDragMove} from '@angular/cdk/drag-drop';


import { PaginasService } from '../menu/paginas.service';
import {Howl} from 'howler';
import { Router, NavigationEnd } from '@angular/router';
import { SettingsPopoverComponent } from './settings-popover/settings-popover.component';
import { Page } from '../menu/page.model';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';




@Component({
  selector: 'app-main-timers',
  templateUrl: './main-timers.page.html',
  styleUrls: ['./main-timers.page.scss'],
})
export class MainTimersPage implements OnInit {

  cajas: Caja[];
  playpage = null;
  thePage: Page;
  private speech: any;
  playingpage = false;
  timerPlaying = 0;


  constructor( public alertController: AlertController,
               private cajasService: CajasService,
               private paginasService: PaginasService,
               private popoverController: PopoverController,
               private tts: TextToSpeech) { }
  ngOnInit() {
    if (this.paginasService.subsMain === undefined) {
      this.paginasService.subsMain = this.paginasService.
      invokeMainNgOnInit.subscribe((name: string) => {
        this.ngOnInit();
      });
    }

    this.paginasService.getObjects().then(_ => {
      this.cajasService.getObjects().then( __ => {
        this.cajas = this.cajasService.getAllCajas();
        this.thePage = this.paginasService.getThePage();
        this.playpage = this.thePage.playpage;
        if (this.cajas.length !== 0) {
          this.timeLeft(0);
          this.displayTimeLeft();
        }
        let a = true;
        let i = -1;
        while (++i < this.cajas.length && a) {
          if (this.cajas[i].type === 'timer') { a = false; }
        }
        this.timerPlaying = --i;
      });
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
  async editPageLapsAlert(){
    const alert = await this.alertController.create({
      header: 'Page laps',
      inputs: [
        {
          name: 'laps',
          type: 'number',
          placeholder: 'Laps: ' + this.thePage.laps,
        }
      ],
      buttons: [
        {
          text: 'Confirm',
          handler: (data) => {
            if (data.laps > 99 || data.laps < 0) {
              this.createCajaTimerAlert();
              this.basicAlert('Wrong values');
            } else {
              if ( data.lasp === '') {data.laps = this.thePage.laps; }
              this.paginasService.setLaps(data.laps);
              this.resetPage();
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
  play(id: number){

    const sound = new Howl({
      src: ['../../assets/beeps/beep-02.mp3'],
      volume: 0.2
    });
    if (this.thePage.speech === true && this.cajas[id].countingValue === this.cajas[id].timerValue) {
      this.speechName(this.cajas[id].timerName);
    }

    this.playingpage = true;
    this.timerPlaying = id;
    this.cajas[id].counting = true;
    --this.cajas[id].countingValue;
    this.displayStringFormer(id);
    this.displayTimeLeft();

    clearInterval(this.cajas[id].interval);
    this.cajas[id].interval = setInterval(() => {
      --this.cajas[id].countingValue;
      --this.thePage.timeleft;
      this.displayStringFormer(id);
      this.displayTimeLeft();
      if ( this.cajas[id].countingValue < 0){
        this.reset(id);
        this.controller(id, 0);
        sound.play();
      }
    }, 1000);
  }
  speechName(toSpeech: string){
    let s = 1;
    const interval = setInterval(() => {
      s--;
      if (s < 0)  {
        this.tts.speak(toSpeech);
        clearInterval(interval);
      }
    }, 100);
  }
  pause(id: number){
    clearInterval(this.cajas[id].interval);
    this.cajas[id].counting = false;
    this.magic();
    this.playingpage = false;
  }
  reset(id: number){
    this.cajas[id].countingValue = this.cajas[id].timerValue;
    this.cajas[id].circuitDoingLap = 1;
    this.displayStringFormer(id);
    this.pause(id);
  }
  resetGroup(groupId: number) {
    const toReset = this.cajas.filter(caja => caja.groupId === groupId );
    for (const c of toReset) {
      this.reset(this.cajas[c.id].id);
    }
  }
  resetPage(){
    let a = true;
    let i = -1;
    while (++i < this.cajas.length && a) {
      if (this.cajas[i].type === 'timer') { a = false; }
    }
    this.timerPlaying = i - 1;
    for (const c of this.cajas) {
      this.reset(this.cajas[c.id].id);
    }
    this.thePage.countingLaps = 1;
    this.timeLeft(0);
    this.displayTimeLeft();
  }

  // Caja controls
  addCaja(type: string, timerName: string, timerValue: number, circuitName: string, circuitLaps: number){
    let cSte = 5;
    if (type === 'circuit') {cSte = 11; }
    let c;
    let gId;
    if ( this.cajas.length !== 0) {
      c = this.cajas[this.cajas.length - 1];
      if (type === 'timer' && c.circuitState !== 0 && c.circuitState !== 10 && c.role !== 'timerHide' ) {
        gId = c.groupId; cSte = 1;
      } else {
        gId = c.groupId + 1;
      }
    } else {
      gId = 0;
    }
    this.cajas.push({
      type,
      role: type,
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
    const from = event.previousIndex;
    let to = event.currentIndex;

    // Corrige ids
    if (event.currentIndex > event.previousIndex && this.cajas[event.currentIndex].circuitState === 10) {
      if (this.cajas.filter(caja => caja.id ===  this.cajas[event.currentIndex].groupId).length > 1 ) {
        to = this.cajas.findIndex(caja => caja.groupId === this.cajas[event.currentIndex].groupId && caja.circuitState === 3);
      }
    }
    if (to > 0) {
      if (event.currentIndex < event.previousIndex && this.cajas[event.currentIndex - 1].circuitState === 10) {
        if (this.cajas.filter(caja => caja.id ===  this.cajas[event.currentIndex - 1].groupId).length > 1 ) {
          to = this.cajas.findIndex(caja => caja.groupId === this.cajas[event.currentIndex - 1].groupId && caja.circuitState === 3);
        }
      }
    }

    // Mueve timers
    if (this.cajas[from].type === 'timer') {

      this.moveCajas(from, to);
      if ( to > 0 ) {
        const a = this.cajas[to - 1];
        if ((a.circuitState === 3 || a.circuitState === 2 || a.circuitState === 1 || a.circuitState === 11) && a.role !== 'timerHide') {
          this.cajas[to].groupId = a.groupId;
        } else {
          this.cajas[to].groupId = 999;
        }
      } else {
        this.cajas[to].groupId = 999;
      }

    } else {

    // Mueve circuitos
      if (from > to) {
        let posToMove = to;
        const cajasToMove = this.cajas.filter( caja => caja.groupId === this.cajas[from].groupId);
        for (const c of cajasToMove) {
          this.moveCajas( c.id, posToMove++);
        }
        if (this.cajas[posToMove].circuitState === 1 || this.cajas[posToMove].circuitState === 2 ||
          this.cajas[posToMove].circuitState === 3 ) {
          let newId = 900;
          let i = posToMove;
          do{
            this.cajas[ i ].groupId = newId++;
          } while (this.cajas[i++].circuitState !== 3);
        }
      } else  if (to > from) {
        const numberOfCajasToMove = this.cajas.filter( caja => caja.groupId === this.cajas[from].groupId).length;
        for (let i = 0; i < numberOfCajasToMove; i++) {
          this.moveCajas( from, to);
        }
        if (to >= this.cajas.length) {
          if (this.cajas[to + 1].circuitState === 1 || this.cajas[to + 1].circuitState === 2 || this.cajas[to + 1].circuitState === 3 ) {
            let newId = 900;
            let i = to + 1;
            do{
              this.cajas[ i ].groupId = newId++;
            } while (this.cajas[i++].circuitState !== 3);
          }
        }
      }

    }


    this.magic();
  }
  drag(id: number) {
    if (this.cajas[id].circuitState > 10) {
      this.circuitHideShowGroup(id);
      // this.ngOnInit();
    }
    this.reset(id);
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
  }
  displayStringFormer(id: number){
    if (this.cajas[id].countingValue !== null){
      this.cajas[id].displayString = this.stringFormer(this.cajas[id].countingValue);
    }
  }
  displayTimeLeft() {
    this.thePage.stringDisplayed = this.stringFormer(this.thePage.timeleft);
  }
  stringFormer(seconds: number) {
    const h = Math.floor(seconds / 3600 );
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 3600 % 60);

    let mm = '';
    let ss = '';
    if ( s < 10 ) { ss = '0' + s; } else { ss = '' + s; }
    if ( m < 10 ) { mm = '0' + m; } else { mm = '' + m; }

    if ( h === 0 ) {
      return m + ':' + ss;
    } else {
      return h + ':' + mm + ':' + ss;
    }

  }

  // Circuit control
  playpausePage(id: number){
    if ( this.playingpage === true ){
      this.controller(this.timerPlaying, 1);
      // this.pause(this.timerPlaying);
    } else {
      this.controller(this.timerPlaying, 1);
      // this.play(this.timerPlaying);
    }
  }
  circuitHideShowGroup(id: number){
    if (this.cajas[id].circuitState === 11) {
      this.changeCircuitState(id, 10);
      const cajasToHide = this.cajas.filter(caja => caja.groupId === this.cajas[id].groupId && caja.type === 'timer');
      for ( const c of cajasToHide) {
        this.cajas[c.id].role = 'timerHide';
      }
    } else {
      this.changeCircuitState(id, 11);
      const cajasToShow = this.cajas.filter(caja => caja.groupId === this.cajas[id].groupId && caja.role === 'timerHide');
      for ( const c of cajasToShow) {
        this.cajas[c.id].role = 'timer';
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
  }
  controller(id: number, flag: number) { // Es llapada al empezar y acabar un timer
    if ( flag === 1 ) {

      if ( this.cajas[id].counting === true ){
        this.pause(id);
      } else {
        const saveCountingValue = this.cajas[id].countingValue;
        if (this.thePage.playpage === true) {
          for (const c of this.cajas) {
            if (this.cajas[c.id].type === 'timer') { this.reset(c.id); }
          }
        }
        const timersToReset = this.cajas.filter(caja => caja.groupId === this.cajas[id].groupId);
        for (const t of timersToReset) {
          if (this.cajas[t.id].type === 'timer') { this.reset(t.id); }
        }
        this.cajas[id].countingValue = saveCountingValue;
        this.timeLeft(id);
        // --this.thePage.timeleft;
        this.play(id);
      }

    } else {

      this.reset(id);
      const timer = this.cajas[id];
      const circuit = this.cajas[this.cajas.findIndex(caja => caja.groupId === timer.groupId && caja.circuitPos === 1)];

      let idToPlay = -5;
      // -1 siguiente grupo/timer
      // -2 continuar circuito
      // -3 primero de circuito
      // -4 primero de pagina
      // -5 END

      // Calcula estado
      if (timer.circuitState === 0 && this.thePage.playpage === true) { idToPlay = -1; }
      if (timer.circuitState === 3 && circuit.circuitDoingLap >= circuit.circuitLaps) {
        if ( this.thePage.playpage === true) {idToPlay = -1; }
        this.cajas[circuit.id].circuitDoingLap = 1;
      } else if (timer.circuitState === 3) {
        idToPlay = -3;
        ++this.cajas[circuit.id].circuitDoingLap;
      } else if ( timer.circuitState === 1 || timer.circuitState === 2 ) {
        idToPlay = -2;
      }
      if (idToPlay === -1 && this.cajas[id].id === (this.cajas.length - 1) ) {
        if (this.thePage.countingLaps >= this.thePage.laps) { idToPlay = -5; }
        if (this.thePage.countingLaps < this.thePage.laps) { this.thePage.countingLaps++; idToPlay = -4; }
      }

      // Asigna comportamiento
      if (idToPlay === -1) {
        let a = true;
        let i = id;
        while (++i < this.cajas.length && a) {
          if (this.cajas[i].type === 'timer') { a = false; }
        }
        idToPlay = --i;
      }
      if (idToPlay === -2) {idToPlay = id + 1; }
      if (idToPlay === -3) {idToPlay = circuit.id + 1; }
      if (idToPlay === -4) {
        this.paginasService.setCountingLaps(this.thePage.countingLaps);
        let a = true;
        let i = -1;
        while (++i < this.cajas.length && a) {
          if (this.cajas[i].type === 'timer') { a = false; }
        }
        idToPlay = --i;
      }
      if (idToPlay === -5) {
        this.resetPage();
        this.paginasService.setCountingLaps(this.thePage.countingLaps);
      } else {
        console.log(idToPlay);
        this.controller(idToPlay, 1);
      }

    }
  }
  timeLeft(id: number) {
    let time = 0;
    let h = this.thePage.countingLaps;
    let i = this.cajas[id].groupId;
    let j = this.cajas[this.cajas.findIndex(caja => caja.groupId === i && caja.circuitPos === 1)].circuitDoingLap;
    let k = id;
    for ( h; h <= this.thePage.laps; h++) {
      for ( i ; i <= this.cajas[this.cajas.length - 1].groupId; i++) {
        let tam = 0;
        for (const c of this.cajas) {
          if (c.groupId === i) { tam++; }
        }
        if (tam === 1) {
          const cajaId = this.cajas.findIndex(caja => caja.groupId === i );
          if (this.cajas[cajaId].type === 'timer') {time = time + this.cajas[k].countingValue; }
          // MAL
          k++;
        }
        if (tam > 1) {
          const lastId = this.cajas.findIndex(caja => caja.groupId === i && caja.circuitState === 3);
          for ( j; j <= this.cajas[this.cajas.findIndex(caja => caja.groupId === i && caja.circuitPos === 1)].circuitLaps; j++) {
            for (k; k <= lastId; k++) {
              time = time + this.cajas[k].countingValue;
            }
            k = this.cajas.findIndex(caja => caja.groupId === i && caja.circuitPos === 2);
          }
          j = 1;
          // MAL
          k++;
        }
      }
      i = 0;
      // MAL
      k = 0;
    }
    this.thePage.timeleft = time;
  }

  // Page settings
  async settingsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: SettingsPopoverComponent,
      event: ev
    });
    return await popover.present();
  }

}

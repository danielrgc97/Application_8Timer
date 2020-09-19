import { Injectable, EventEmitter } from '@angular/core';
import { Page } from './page.model';

import { Plugins} from '@capacitor/core';
import { Subscription } from 'rxjs';
import { CajasService } from '../main-timers/cajas.service';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PaginasService {

  paginas: Page[] = [];
  thePage: number;

  invokeMainNgOnInit = new EventEmitter();
  subsMain: Subscription;

  invokeMenuNgOnInit = new EventEmitter();
  subsMenu: Subscription;

  constructor() { }

  // Ivocacion de ngOnInits
  mainNgOnInit() {
    this.invokeMainNgOnInit.emit();
  }
  menuNgOnInit() {
    this.invokeMenuNgOnInit.emit();
  }

  // Logica page
  getAllPages(){
    return [...this.paginas];
  }
  volcarPages(ps: Page[]){
    this.paginas = [];
    for ( let i = 0 ; i < ps.length ; i++){
      this.paginas[i] = ps[i];
    }
    this.setObjects();
    this.mainNgOnInit();
  }
  setThePage(id: number) {
    this.thePage = id;
    this.mainNgOnInit();
  }
  getThePage() {
    return this.paginas[this.thePage];
  }
  setPlayPage(bol: boolean) {
    this.paginas[this.thePage].playpage = bol;
    this.volcarPages(this.paginas);
  }
  setSpeech(bol: boolean) {
    this.paginas[this.thePage].speech = bol;
    this.volcarPages(this.paginas);
  }
  setLaps( laps: number) {
    this.paginas[this.thePage].laps = laps;
    this.volcarPages(this.paginas);
  }
  setCountingLaps( laps: number) {
    this.paginas[this.thePage].countingLaps = laps;
    this.setObjects();
  }
  deletePage(id: number){
    this.setThePage(0);
    this.paginas.splice(id, 1);
    this.volcarPages(this.paginas);
    this.menuNgOnInit();
  }

  // Gestion de almacenamiento
  async getObjects() {
    const s = await Storage.get({ key: 'MenuPages' });
    const j = JSON.parse(s.value);
    if ( j != null){
      this.paginas = [];
      for ( let i = 0 ; i < j.length ; i++){
        this.paginas[i] = j[i];
      }
    }
    if (this.paginas[0] === undefined) {
      this.paginas.push(
        { id: 0, name: 'My First Page', playpage: false, speech: false, laps: 1, countingLaps: 1, timeleft: 0, stringDisplayed: '' },
        { id: 1, name: 'Sample Workout', playpage: true, speech: true, laps: 1, countingLaps: 1, timeleft: 0, stringDisplayed: '' }
      );
      this.setObjects();
    }
    if (this.thePage === undefined) { this.thePage = 0; }
    return s;
  }
  async setObjects() {
    const j = [];
    if ( this.paginas != null){
      for ( let i = 0 ; i < this.paginas.length ; i++){
        j[i] = this.paginas[i];
      }
    }
    await Storage.set({key: 'MenuPages', value: JSON.stringify(j)
    });
  }


}

import { Injectable, EventEmitter } from '@angular/core';
import { Page } from './page.model';

import { Plugins} from '@capacitor/core';
import { Subscription } from 'rxjs';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PaginasService {

  paginas: Page[] = [];
  thePage: number;



  invokeNgOnInit = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

  // Ivocacion de ngOnInit de la main
  ngOnInitEventEmit() {
    this.invokeNgOnInit.emit();
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
  }
  setThePage(id: number) {
    this.thePage = id;
  }
  getThePage() {
    return this.paginas[this.thePage];
  }
  setPlayPage(bol: boolean) {
    this.paginas[this.thePage].playpage = bol;
    this.volcarPages(this.paginas);
    this.ngOnInitEventEmit();
  }
  setSpeech(bol: boolean) {
    this.paginas[this.thePage].speech = bol;
    this.volcarPages(this.paginas);
    this.ngOnInitEventEmit();
  }

  // Funciones gestion de almacenamiento

  async getObjects() {
    const s = await Storage.get({ key: 'MenuPages' });
    const j = JSON.parse(s.value);
    if ( j != null){
      for ( let i = 0 ; i < j.length ; i++){
        this.paginas[i] = j[i];
      }
    }
    if (this.paginas[0] === undefined) {this.paginas.push({ id: 0, name: 'Default', playpage: false, speech: false}); this.setObjects(); }
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

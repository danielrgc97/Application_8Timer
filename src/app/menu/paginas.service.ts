import { Injectable } from '@angular/core';
import { Page } from './page.model';

import { Plugins} from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PaginasService {

  paginas: Page[];

  constructor() {
    this.paginas = [
      {
        id: 0,
        name: 'default',
        playPage: false,
        dictadoNombres: false
      },
      {
        id: 1,
        name: 'monday',
        playPage: false,
        dictadoNombres: false
      }
    ];
  }

  getAllCajas(){
    return [...this.paginas];
  }

  volcarPages(cs: Page[]){
    this.paginas = [];
    for ( let i = 0 ; i < cs.length ; i++){
      this.paginas[i] = cs[i];
    }
    this.setObjects();
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

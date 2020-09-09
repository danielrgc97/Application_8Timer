import { Injectable } from '@angular/core';
import { Caja } from './caja.model';

import { Plugins} from '@capacitor/core';
import { PaginasService } from '../menu/paginas.service';
import { Page } from '../menu/page.model';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  thePage: Page;
  cajas: Caja[] = [];

  constructor(private paginasService: PaginasService) {}

  // Funciones de la logica de servicio cajas

  getAllCajas(){
    return [...this.cajas];
  }

  volcarCajas(cs: Caja[]){
    this.cajas = [];
    for ( let i = 0 ; i < cs.length ; i++){
      this.cajas[i] = cs[i];
    }
    this.setObjects();
  }

  // Funciones gestion de almacenamiento

  async getObjects() {
    this.thePage = this.paginasService.getThePage();
    const s = await Storage.get({ key: this.thePage.name });
    const j = JSON.parse(s.value);
    this.cajas = [];

    if ( j != null){
      for ( let i = 0 ; i < j.length ; i++){
        this.cajas[i] = j[i];
      }
      return s;
    }
  }

  async setObjects() {
    this.thePage = this.paginasService.getThePage();
    console.log('halooooooooooooo');
    const j = [];
    if ( this.cajas != null){
      for ( let i = 0 ; i < this.cajas.length ; i++){
        j[i] = this.cajas[i];
      }
    }
    await Storage.set({key: this.thePage.name, value: JSON.stringify(j)
    });
  }
}

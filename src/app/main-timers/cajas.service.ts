import { Injectable } from '@angular/core';
import { Caja } from './caja.model';

import { Plugins} from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class CajasService {
  cajas: Caja[] = [];
  json = [];

  constructor() {  }

  // Funciones de gestion de almacenamiento

  async getObjects() {
    const j = await Storage.get({ key: '8Timer' });
    this.json = JSON.parse(j.value);
    if ( this.json != null){
      for ( let i = 0 ; i < this.json.length ; i++){
        this.cajas[i] = this.json[i];
      }
    }
    return j;
  }

  async setObjects() {
    if ( this.cajas != null){
      this.json = [];
      for ( let i = 0 ; i < this.cajas.length ; i++){
        this.json[i] = this.cajas[i];
      }
    }
    await Storage.set({key: '8Timer', value: JSON.stringify(this.json)
    });
  }

  // Funciones de la logica cajas.service
  
  getAllCajas(){
    return [...this.cajas];
  }

  addCaja(nombre: string, timerValue: string){
    const id = '' + this.cajas.length;
    this.cajas.push({ id , nombre, timerValue});
    this.setObjects();
  }

}

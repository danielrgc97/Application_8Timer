import { Injectable } from '@angular/core';
import { Caja } from './caja.model';

import { Plugins} from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class CajasService {
  cajas: Caja[] = [];

  constructor() {}

  // Funciones de la logica de servicio cajas

  getAllCajas(){
    return [...this.cajas];
  }

  addCaja(nombre: string, timerValue: number, role: string){
    this.cajas.push({
      id: this.cajas.length,
      nombre, timerValue,
      countingValue: timerValue,
      counting: false,
      interval: null,
      role});
    this.setObjects();
  }

  deleteCaja(id: number){
    this.cajas.splice( id, 1);
    this.setObjects();
  }

  editCaja(id: number, nombre: string, timerValue: number){
    this.cajas[id].nombre = nombre;
    this.cajas[id].timerValue = timerValue;
    this.cajas[id].countingValue = timerValue;
    this.setObjects();
  }

  volcarCajas(cs: Caja[]){
    this.cajas = [];
    for ( let i = 0 ; i < cs.length ; i++){
      this.cajas[i] = cs[i];
    }
    this.setObjects();
  }


  // Funciones de gestion de almacenamiento

  async getObjects() {
    const s = await Storage.get({ key: '8Timer' });
    const j = JSON.parse(s.value);
    if ( j != null){
      for ( let i = 0 ; i < j.length ; i++){
        this.cajas[i] = j[i];
      }
    }
    return s;
  }

  async setObjects() {
    const j = [];
    if ( this.cajas != null){
      for ( let i = 0 ; i < this.cajas.length ; i++){
        j[i] = this.cajas[i];
      }
    }
    await Storage.set({key: '8Timer', value: JSON.stringify(j)
    });
  }
}

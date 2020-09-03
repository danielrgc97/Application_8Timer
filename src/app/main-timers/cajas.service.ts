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
  // addCaja(type: string, circuitState: number, timerName: string, timerValue: number, circuitName: string, circuitLaps: number){
  //   this.cajas.push({
  //     type,
  //     enabled: true,
  //     circuitState,
  //     id: this.cajas.length,
  //     timerName,
  //     timerValue,
  //     countingValue: timerValue,
  //     displayString: null,
  //     counting: false,
  //     interval: null,
  //     circuitName,
  //     circuitLaps
  //   });
  //   this.setObjects();
  // }
  // editCaja(id: number, timerName: string, timerValue: number, circuitName: string, circuitLaps: number){
  //   this.cajas[id].timerName = timerName;
  //   this.cajas[id].timerValue = timerValue;
  //   this.cajas[id].countingValue = timerValue;
  //   this.cajas[id].circuitName = circuitName;
  //   this.cajas[id].circuitLaps = circuitLaps;
  //   this.setObjects();
  // }
  // deleteCaja(id: number){
  //   this.cajas.splice( id, 1);
  //   this.orderIds();
  //   this.setObjects();
  // }
  // orderIds(){
  //   let i = 0;
  //   for (const c of this.cajas){
  //     c.id = i++;
  //   }
  // }
  volcarCajas(cs: Caja[]){
    this.cajas = [];
    for ( let i = 0 ; i < cs.length ; i++){
      this.cajas[i] = cs[i];
    }
    this.setObjects();
  }
  // moveCajas(fromId: number, toId: number) {
  //   const tempCaja = this.cajas[fromId];
  //   if (fromId < toId){
  //     for (let i = fromId; i < toId; i++){
  //       this.cajas[i] = this.cajas[i + 1];
  //       this.cajas[i].id = i;
  //     }
  //   } else {
  //     for (let i = fromId; i > toId; i--){
  //       this.cajas[i] = this.cajas[i - 1];
  //       this.cajas[i].id = i;
  //     }
  //   }
  //   this.cajas[toId] = tempCaja;
  //   this.cajas[toId].id = toId;
  //   this.setObjects();
  // }
  // changeCircuitState(id: number, num: number){
  //   this.cajas[id].circuitState = num;
  //   this.setObjects();
  // }

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

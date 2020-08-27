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

  constructor() {
    // this.json = [
    //   {id: '1', nombre: 'jon', timerValue: '10'},
    //   {id: '2', nombre: 'miguel', timerValue: '10'},
    //   {id: '3', nombre: 'kike', timerValue: '10'}
    // ];
  }

  getAllCajas(){
    this.getObjects();
    return [...this.cajas];
  }

  async getObjects() {
    const j = await Storage.get({ key: '8Timer' });
    this.json = JSON.parse(j.value);

    for ( let i = 0 ; i < this.json.length ; i++){
      this.cajas[i] = this.json[i];
    }
  }

  async setObjects() {
    console.log(this.json);
    await Storage.set({key: '8Timer', value: JSON.stringify(this.json)
    });
  }


  addCaja(id: string, nombre: string, timerValue: string){
    this.cajas.push({ id, nombre, timerValue});
  }

}

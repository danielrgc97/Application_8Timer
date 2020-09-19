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

    if (this.thePage.name === 'My First Page' && this.cajas[0] === undefined) {
      this.volcarCajas(
        [{"type":"timer","role":"timer","groupId":0,"display":true,"enabled":true,"circuitState":0,"id":0,"timerName":"Welcome","timerValue":10,"countingValue":10,"displayString":"0:10","counting":false,"interval":null,"circuitPos":1,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true}]
      );
      this.setObjects();
    }

    if (this.thePage.name === 'Sample Workout' && this.cajas[0] === undefined) {
      this.volcarCajas(
        [{"type":"timer","role":"timer","groupId":0,"display":true,"enabled":true,"circuitState":0,"id":0,"timerName":"Warm-up","timerValue":60,"countingValue":60,"displayString":"1:00","counting":false,"interval":328,"circuitPos":1,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true},{"type":"timer","role":"timer","groupId":1,"display":true,"enabled":true,"circuitState":0,"id":1,"timerName":"preparing","timerValue":30,"countingValue":30,"displayString":"0:30","counting":false,"interval":78,"circuitPos":1,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true},{"type":"circuit","role":"circuit","groupId":2,"display":true,"enabled":true,"circuitState":11,"id":2,"timerName":null,"timerValue":null,"countingValue":null,"displayString":null,"counting":false,"interval":null,"circuitPos":1,"circuitName":"Sample serie","circuitDoingLap":1,"circuitLaps":3,"visible":true},{"type":"timer","role":"timer","groupId":2,"display":true,"enabled":true,"circuitState":1,"id":3,"timerName":"Exercise 1","timerValue":20,"countingValue":20,"displayString":"0:20","counting":false,"interval":214,"circuitPos":2,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true},{"type":"timer","role":"timer","groupId":2,"display":true,"enabled":true,"circuitState":2,"id":4,"timerName":"exercise 2","timerValue":20,"countingValue":20,"displayString":"0:20","counting":false,"interval":198,"circuitPos":3,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true},{"type":"timer","role":"timer","groupId":2,"display":true,"enabled":true,"circuitState":3,"id":5,"timerName":"rest","timerValue":10,"countingValue":10,"displayString":"0:10","counting":false,"interval":212,"circuitPos":4,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true}]
      );
      this.setObjects();
    }
  }

  async setObjects() {
    this.thePage = this.paginasService.getThePage();
    const j = [];
    if ( this.cajas != null){
      for ( let i = 0 ; i < this.cajas.length ; i++){
        j[i] = this.cajas[i];
      }
    }
    // console.log(JSON.stringify(j));
    await Storage.set({key: this.thePage.name, value: JSON.stringify(j)
    });
  }
}

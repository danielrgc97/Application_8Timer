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

    if (this.thePage.name === 'Default' && this.cajas[0] === undefined) {
      this.volcarCajas(
          [{"type":"timer","role":"timer","groupId":0,"display":true,"enabled":true,"circuitState":0,"id":0,"timerName":"preparing","timerValue":1,"countingValue":1,"displayString":"0:01","counting":false,"interval":374,"circuitPos":1,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true},{"type":"circuit","role":"circuit","groupId":1,"display":true,"enabled":true,"circuitState":11,"id":1,"timerName":null,"timerValue":null,"countingValue":null,"displayString":null,"counting":false,"interval":null,"circuitPos":1,"circuitName":"warm up","circuitDoingLap":1,"circuitLaps":1,"visible":true},{"type":"timer","role":"timer","groupId":1,"display":true,"enabled":true,"circuitState":1,"id":2,"timerName":"jumping","timerValue":5,"countingValue":5,"displayString":"0:05","counting":false,"interval":384,"circuitPos":2,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true},{"type":"timer","role":"timer","groupId":1,"display":true,"enabled":true,"circuitState":3,"id":3,"timerName":"running","timerValue":4,"countingValue":4,"displayString":"0:04","counting":false,"interval":306,"circuitPos":3,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true},{"type":"circuit","role":"circuit","groupId":2,"display":true,"enabled":true,"circuitState":11,"id":4,"timerName":null,"timerValue":null,"countingValue":null,"displayString":null,"counting":false,"interval":null,"circuitPos":1,"circuitName":"Sample series","circuitDoingLap":1,"circuitLaps":3,"visible":true},{"type":"timer","role":"timer","groupId":2,"display":true,"enabled":true,"circuitState":1,"id":5,"timerName":"Exercise 1","timerValue":3,"countingValue":3,"displayString":"0:03","counting":false,"interval":310,"circuitPos":2,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true},{"type":"timer","role":"timer","groupId":2,"display":true,"enabled":true,"circuitState":2,"id":6,"timerName":"exercise 2","timerValue":4,"countingValue":4,"displayString":"0:04","counting":false,"interval":354,"circuitPos":3,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true},{"type":"timer","role":"timer","groupId":2,"display":true,"enabled":true,"circuitState":2,"id":7,"timerName":"exercise 3","timerValue":5,"countingValue":5,"displayString":"0:05","counting":false,"interval":344,"circuitPos":4,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true},{"type":"timer","role":"timer","groupId":2,"display":true,"enabled":true,"circuitState":3,"id":8,"timerName":"rest","timerValue":2,"countingValue":2,"displayString":"0:02","counting":false,"interval":234,"circuitPos":5,"circuitName":null,"circuitDoingLap":1,"circuitLaps":null,"visible":true},{"type":"circuit","role":"circuit","groupId":3,"display":true,"enabled":true,"circuitState":11,"id":9,"timerName":null,"timerValue":null,"countingValue":null,"displayString":null,"counting":false,"interval":null,"circuitPos":1,"circuitName":"Sample series 2","circuitDoingLap":1,"circuitLaps":2,"visible":true},{"type":"circuit","role":"circuit","groupId":4,"display":true,"enabled":true,"circuitState":11,"id":10,"timerName":null,"timerValue":null,"countingValue":null,"displayString":null,"counting":false,"interval":null,"circuitPos":1,"circuitName":"Sample series 3","circuitDoingLap":1,"circuitLaps":2,"visible":true},{"type":"circuit","role":"circuit","groupId":6,"display":true,"enabled":true,"circuitState":11,"id":12,"timerName":null,"timerValue":null,"countingValue":null,"displayString":null,"counting":false,"interval":null,"circuitPos":1,"circuitName":"Sample series 4","circuitDoingLap":1,"circuitLaps":2,"visible":true}]
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

import { Component, OnInit } from '@angular/core';
import { Caja } from './caja.model';
import { CajasService } from './cajas.service';

import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';

const { Storage } = Plugins;

const { Filesystem } = Plugins;


@Component({
  selector: 'app-main-timers',
  templateUrl: './main-timers.page.html',
  styleUrls: ['./main-timers.page.scss'],
})
export class MainTimersPage implements OnInit {
  cajas: Caja[];
  json = [];

  constructor( private cajasService: CajasService) {}

  ngOnInit() {
    this.cajas = this.cajasService
  }


  a(){
    this.cajasService.setObjects();
  }

  b(){
    this.cajasService.getObjects();
  }

}

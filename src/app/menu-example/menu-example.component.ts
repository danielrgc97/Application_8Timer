import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu-example',
  templateUrl: './menu-example.component.html',
  styleUrls: ['./menu-example.component.scss'],
})
export class MenuExampleComponent implements OnInit {

  constructor(private menu: MenuController) { }

  ngOnInit() {}

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

}

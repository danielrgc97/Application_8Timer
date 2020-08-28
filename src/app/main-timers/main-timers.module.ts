import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainTimersPageRoutingModule } from './main-timers-routing.module';

import { MainTimersPage } from './main-timers.page';
import { MenuExampleComponent } from '../menu-example/menu-example.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainTimersPageRoutingModule
  ],
  declarations: [MainTimersPage, MenuExampleComponent]
})
export class MainTimersPageModule {}

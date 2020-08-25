import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainTimersPageRoutingModule } from './main-timers-routing.module';

import { MainTimersPage } from './main-timers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainTimersPageRoutingModule
  ],
  declarations: [MainTimersPage]
})
export class MainTimersPageModule {}

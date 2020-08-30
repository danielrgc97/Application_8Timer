import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainTimersPageRoutingModule } from './main-timers-routing.module';

import { MainTimersPage } from './main-timers.page';
import { MenuExampleComponent } from '../menu-example/menu-example.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainTimersPageRoutingModule,
    DragDropModule
  ],
  declarations: [MainTimersPage, MenuExampleComponent]
})
export class MainTimersPageModule {}

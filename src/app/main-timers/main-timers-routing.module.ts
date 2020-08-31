import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainTimersPage } from './main-timers.page';

const routes: Routes = [
  {
    path: '',
    component: MainTimersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTimersPageRoutingModule {}

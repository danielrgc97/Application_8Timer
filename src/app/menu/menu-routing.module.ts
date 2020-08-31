import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'main-timers',
        loadChildren: () => import('../main-timers/main-timers.module').then( m => m.MainTimersPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/menu/main-timers'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}

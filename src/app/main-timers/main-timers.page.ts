import { Component, OnInit } from '@angular/core';
import { Timer } from './timer.model';

@Component({
  selector: 'app-main-timers',
  templateUrl: './main-timers.page.html',
  styleUrls: ['./main-timers.page.scss'],
})
export class MainTimersPage implements OnInit {
  timers: Timer[] = [
    {
      id: '1',
      timerValue: '10'
    },
    {
      id: '2',
      timerValue: '5'
    }
  ];

  constructor() { }

  ngOnInit() {
  }
}

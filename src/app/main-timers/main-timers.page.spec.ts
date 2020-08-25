import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainTimersPage } from './main-timers.page';

describe('MainTimersPage', () => {
  let component: MainTimersPage;
  let fixture: ComponentFixture<MainTimersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainTimersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainTimersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

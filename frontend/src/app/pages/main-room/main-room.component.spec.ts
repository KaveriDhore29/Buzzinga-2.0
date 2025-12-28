import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRoomComponent } from './main-room.component';

describe('MainRoomComponent', () => {
  let component: MainRoomComponent;
  let fixture: ComponentFixture<MainRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

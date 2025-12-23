import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskRoomComponent } from './ask-room.component';

describe('AskRoomComponent', () => {
  let component: AskRoomComponent;
  let fixture: ComponentFixture<AskRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

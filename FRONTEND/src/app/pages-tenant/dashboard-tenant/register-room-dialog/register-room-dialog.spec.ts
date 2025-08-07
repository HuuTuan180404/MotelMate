import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRoomDialog } from './register-room-dialog';

describe('RegisterRoomDialog', () => {
  let component: RegisterRoomDialog;
  let fixture: ComponentFixture<RegisterRoomDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterRoomDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterRoomDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

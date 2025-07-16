import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paymentrequest } from './paymentrequest';

describe('Paymentrequest', () => {
  let component: Paymentrequest;
  let fixture: ComponentFixture<Paymentrequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paymentrequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paymentrequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Invoicetable } from './invoicetable';

describe('Invoicetable', () => {
  let component: Invoicetable;
  let fixture: ComponentFixture<Invoicetable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Invoicetable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Invoicetable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

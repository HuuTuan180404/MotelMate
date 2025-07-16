import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCreateForm } from './invoice-create-form';

describe('InvoiceCreateForm', () => {
  let component: InvoiceCreateForm;
  let fixture: ComponentFixture<InvoiceCreateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceCreateForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceCreateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

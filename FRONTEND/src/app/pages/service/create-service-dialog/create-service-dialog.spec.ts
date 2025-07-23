import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServiceDialog } from './create-service-dialog';

describe('CreateServiceDialog', () => {
  let component: CreateServiceDialog;
  let fixture: ComponentFixture<CreateServiceDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateServiceDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateServiceDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tenantmanagement } from './tenantmanagement';

describe('Tenantmanagement', () => {
  let component: Tenantmanagement;
  let fixture: ComponentFixture<Tenantmanagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tenantmanagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tenantmanagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

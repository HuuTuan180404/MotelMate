import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantManagement } from './tenantmanagement';

describe('Tenantmanagement', () => {
  let component: TenantManagement;
  let fixture: ComponentFixture<TenantManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

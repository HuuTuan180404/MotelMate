import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tenantdetail } from './tenantdetail';

describe('Tenantdetail', () => {
  let component: Tenantdetail;
  let fixture: ComponentFixture<Tenantdetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tenantdetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tenantdetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

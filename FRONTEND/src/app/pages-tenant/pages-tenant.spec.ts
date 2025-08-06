import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesTenant } from './pages-tenant';

describe('PagesTenant', () => {
  let component: PagesTenant;
  let fixture: ComponentFixture<PagesTenant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagesTenant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagesTenant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

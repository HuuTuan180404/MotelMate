import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Buildingmanagement } from './buildingmanagement';

describe('Buildingmanagement', () => {
  let component: Buildingmanagement;
  let fixture: ComponentFixture<Buildingmanagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Buildingmanagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Buildingmanagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Roommanagement } from './roommanagement';

describe('Roommanagement', () => {
  let component: Roommanagement;
  let fixture: ComponentFixture<Roommanagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Roommanagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Roommanagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

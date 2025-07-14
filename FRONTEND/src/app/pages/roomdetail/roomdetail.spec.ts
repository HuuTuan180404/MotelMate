import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Roomdetail } from './roomdetail';

describe('Roomdetail', () => {
  let component: Roomdetail;
  let fixture: ComponentFixture<Roomdetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Roomdetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Roomdetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

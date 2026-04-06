import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyComponent } from './pharmacy.component';

describe('PharmacyComponent', () => {
  let component: PharmacyComponent;
  let fixture: ComponentFixture<PharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

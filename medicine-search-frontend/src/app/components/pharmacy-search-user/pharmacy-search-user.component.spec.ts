import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacySearchUserComponent } from './pharmacy-search-user.component';

describe('PharmacySearchUserComponent', () => {
  let component: PharmacySearchUserComponent;
  let fixture: ComponentFixture<PharmacySearchUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacySearchUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacySearchUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

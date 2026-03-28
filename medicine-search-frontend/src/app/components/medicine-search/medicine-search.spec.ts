import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineSearch } from './medicine-search';

describe('MedicineSearch', () => {
  let component: MedicineSearch;
  let fixture: ComponentFixture<MedicineSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicineSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicineSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

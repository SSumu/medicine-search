import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacySearchService } from './pharmacy-search.service';

describe('PharmacyService', () => {
  let component: PharmacySearchService;
  let fixture: ComponentFixture<PharmacySearchService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacySearchService],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacySearchService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

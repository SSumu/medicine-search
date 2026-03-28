import { TestBed } from '@angular/core/testing';

import { MedicineService } from '../../core/services/medicine/medicine.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MedicineService', () => {
  let service: MedicineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MedicineService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MedicineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

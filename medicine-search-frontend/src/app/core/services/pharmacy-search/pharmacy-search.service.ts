import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PharmacyDTO {
  pharmacyId: number;
  pharmacyName: string;
  pharmacyLocation: string;
}

export interface MedicineDTO {
  medicineId: number;
  medicineName: string;
}

export interface PharmacyResponseDTO {
  id: number;
  pharmacy: PharmacyDTO;
  medicine: MedicineDTO;
  quantity: number;
  price: number;
  lastUpdated?: string;
}

export interface PharmacyRequestDTO {
  pharmacyName: string;
  pharmacyLocation: string;
  city: string;
  country: string;
  contactNumber: number | null;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class PharmacySearchService {
  private baseUrl = `${environment.apiUrl}/pharmacies`; // change to deployed backend URL

  constructor(private http: HttpClient) {}

  getAllPharmacies(): Observable<PharmacyResponseDTO[]> {
    return this.http.get<PharmacyResponseDTO[]>(`${this.baseUrl}/get-all`);
  }

  searchByPharmacy(pharmacyName: string): Observable<PharmacyResponseDTO[]> {
    return this.http.get<PharmacyResponseDTO[]>(`${this.baseUrl}/search/pharmacy?pharmacyName=${pharmacyName}`);
  }

  searchByLocation(location: string): Observable<PharmacyResponseDTO[]> {
    return this.http.get<PharmacyResponseDTO[]>(
      `${this.baseUrl}/search/location?location=${location}`,
    );
  }

  getAvailable(): Observable<PharmacyResponseDTO[]> {
    return this.http.get<PharmacyResponseDTO[]>(`${this.baseUrl}/available`);
  }

  createPharmacy(data: any): Observable<PharmacyResponseDTO> {
    return this.http.post<PharmacyResponseDTO>(this.baseUrl, data);
  }

  updatePharmacy(id: number, data: any): Observable<PharmacyResponseDTO> {
    return this.http.put<PharmacyResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  deletePharmacy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  refreshPharmacies(): Observable<PharmacyResponseDTO[]> {
    return this.getAllPharmacies()
  }
}

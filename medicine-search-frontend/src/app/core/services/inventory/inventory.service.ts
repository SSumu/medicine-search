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

export interface InventoryResponseDTO {
  id: number;
  pharmacy: PharmacyDTO;
  medicine: MedicineDTO;
  quantity: number;
  price: number;
  lastUpdated?: string;
}

export interface InventoryRequestDTO {
  pharmacyName: string;
  pharmacyLocation: string;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private baseUrl = `${environment.apiUrl}/inventory`; // change to deployed backend URL

  constructor(private http: HttpClient) {}

  getAllInventories(): Observable<InventoryResponseDTO[]> {
    return this.http.get<InventoryResponseDTO[]>(this.baseUrl);
  }

  searchByPharmacy(pharmacyName: string): Observable<InventoryResponseDTO[]> {
    return this.http.get<InventoryResponseDTO[]>(`${this.baseUrl}/search/pharmacy?pharmacyName=${pharmacyName}`);
  }

  searchByMedicine(medicineName: string): Observable<InventoryResponseDTO[]> {
    return this.http.get<InventoryResponseDTO[]>(`${this.baseUrl}/search/medicine?medicineName=${medicineName}`);
  }

  searchByLocation(location: string): Observable<InventoryResponseDTO[]> {
    return this.http.get<InventoryResponseDTO[]>(
      `${this.baseUrl}/search/location?location=${location}`,
    );
  }

  getAvailable(): Observable<InventoryResponseDTO[]> {
    return this.http.get<InventoryResponseDTO[]>(`${this.baseUrl}/available`);
  }

  createInventory(data: any): Observable<InventoryResponseDTO> {
    return this.http.post<InventoryResponseDTO>(this.baseUrl, data);
  }

  updateInventory(id: number, data: any): Observable<InventoryResponseDTO> {
    return this.http.put<InventoryResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  refreshInventories(): Observable<InventoryResponseDTO[]> {
    return this.getAllInventories()
  }
}

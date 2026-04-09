import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Medicine } from '../../../models/medicine/medicine.model';

export interface InventoryResponseDTO {
  id: number;
  pharmacyName: string;
  pharmacyLocation: string;
  medicineName: string;
  quantity?: Medicine;
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

  searchByPharmacy(pharmacyName: string): Observable<InventoryResponseDTO> {
    return this.http.get<InventoryResponseDTO>(`${this.baseUrl}/search/pharmacy?medicineName${pharmacyName}`);
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

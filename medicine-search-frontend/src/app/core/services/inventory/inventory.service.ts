import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface InventoryResponseDTO {
  id: number;
  pharmacyName: string;
  pharmacyLocation: string;
  medicineName: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private baseUrl = `${environment.apiUrl}/inventory`; // change to deployed backend URL

  constructor(private http: HttpClient) {}

  getAll(): Observable<InventoryResponseDTO[]> {
    return this.http.get<InventoryResponseDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<InventoryResponseDTO> {
    return this.http.get<InventoryResponseDTO>(`${this.baseUrl}/${id}`);
  }

  searchByMedicine(name: string): Observable<InventoryResponseDTO[]> {
    return this.http.get<InventoryResponseDTO[]>(`${this.baseUrl}/search/medicine?name=${name}`);
  }

  searchByLocation(location: string): Observable<InventoryResponseDTO[]> {
    return this.http.get<InventoryResponseDTO[]>(
      `${this.baseUrl}/search/location?location=${location}`,
    );
  }

  getAvailable(): Observable<InventoryResponseDTO[]> {
    return this.http.get<InventoryResponseDTO[]>(`${this.baseUrl}/available`);
  }

  create(data: any): Observable<InventoryResponseDTO> {
    return this.http.post<InventoryResponseDTO>(this.baseUrl, data);
  }

  update(id: number, data: any): Observable<InventoryResponseDTO> {
    return this.http.put<InventoryResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

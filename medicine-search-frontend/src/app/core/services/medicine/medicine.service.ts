import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Medicine {
  id: number;
  name: string;
  manufacturer: string;
  price: number;
  description?: string;
}

// =====================
// API CONFIG (FIXED)
// =====================
const API_CONFIG = {
  BASE_URL: (window as any)['env']?.API_URL || 'https://medicine-search-production.up.railway.app',
};

@Injectable({
  providedIn: 'root',
})
export class MedicineService {
  // Base endpoint
  private apiURL = `${API_CONFIG.BASE_URL}/api/medicines`;

  constructor(private http: HttpClient) {}

  // =====================
  // GET ALL MEDICINES
  // =====================
  getAllMedicines(): Observable<Medicine[]> {
    return this.http.get<any>(this.apiURL).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.data) return res.data;
        if (res?.medicines) return res.medicines;
        return [];
      }),
    );
  }

  // =====================
  // GET MEDICINE BY ID
  // =====================
  getMedicineById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.apiURL}/${id}`);
  }

  // =====================
  // ADD MEDICINE
  // =====================
  addMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiURL, medicine);
  }

  // =====================
  // UPDATE MEDICINE
  // =====================
  updateMedicine(id: number, medicine: Medicine): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.apiURL}/${id}`, medicine);
  }

  // =====================
  // DELETE MEDICINE
  // =====================
  deleteMedicine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  // =====================
  // SEARCH MEDICINES
  // =====================
  searchMedicines(keyword: string): Observable<Medicine[]> {
    const url = `${this.apiURL}/search?keyword=${encodeURIComponent(keyword)}`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res?.data) return res.data;
        if (res?.medicines) return res.medicines;
        return [];
      }),
    );
  }

  // =====================
  // REFRESH MEDICINES
  // =====================
  refreshMedicines(): Observable<Medicine[]> {
    return this.getAllMedicines();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Medicine } from '../../../models/medicine/medicine.model';

// =====================
// API CONFIG
// =====================
const API_CONFIG = {
  BASE_URL: (window as any)['env']?.API_URL || environment.apiUrl,
};

@Injectable({
  providedIn: 'root',
})
export class MedicineService {
  // Base endpoint
  private apiUrl = `${API_CONFIG.BASE_URL}/medicine`;

  constructor(private http: HttpClient) {}

  // =====================
  // GET ALL MEDICINES
  // =====================
  getAllMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.apiUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        // if (res?.data) return res.data;
        // if (res?.medicines) return res.medicines;
        return [];
      }),
    );
  }

  // =====================
  // GET MEDICINE BY ID
  // =====================
  getMedicineById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.apiUrl}/${id}`).pipe(
      map(res => ({
        medicineId: res.medicineId,
        medicineName: res.medicineName,
        manufacturer: res.manufacturer,
        quantity: res.quantity,
        price: res.price,
        description: res.description
      }))
    );
  }

  // =====================
  // ADD MEDICINE
  // =====================
  addMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiUrl, medicine);
  }

  // =====================
  // UPDATE MEDICINE
  // =====================
  updateMedicine(id: number, medicine: Medicine): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.apiUrl}/${id}`, medicine);
  }

  // =====================
  // DELETE MEDICINE
  // =====================
  deleteMedicine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // =====================
  // SEARCH MEDICINES (UPDATED)
  // =====================
  searchMedicines( medicineName: string ): Observable<Medicine[]> {
    const url = `${this.apiUrl}/searchByName?medicineName=${encodeURIComponent( medicineName )}`;

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

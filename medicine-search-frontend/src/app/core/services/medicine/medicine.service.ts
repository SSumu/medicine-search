import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Medicine } from '../../../models/medicine/medicine.model';
import { MedicineRequestModel } from '../../../models/medicine-request.model/medicine-request.model';

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

  // ======
  // CACHE
  // ======
  private medicineCache$?: Observable<Medicine[]>;

  constructor(private http: HttpClient) {}

  // ===========================
  // GET ALL MEDICINES (CACHED)
  // ===========================
  getAllMedicines(): Observable<Medicine[]> {

    // 🚨 prevents repeated API calls (popup open/close will NOT re-hit backend)
    if (!this.medicineCache$) {
      this.medicineCache$ = this.http.get<Medicine[]>(this.apiUrl).pipe(
        map((res) => {
          if (Array.isArray(res)) return res;
          return [];
        }),
        shareReplay(1),
      );
    }

    return this.medicineCache$;

    // return this.http.get<Medicine[]>(this.apiUrl).pipe(
    //   map((res) => {
    //     if (Array.isArray(res)) return res;
    //     // if (res?.data) return res.data;
    //     // if (res?.medicines) return res.medicines;
    //     return [];
    //   }),
    // );
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
        description: res.description,
      })),
      shareReplay(1), // prevents duplicate calls if reused
    );
  }

  // =====================
  // ADD MEDICINE
  // =====================
  addMedicine(medicine: MedicineRequestModel): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiUrl, medicine);
  }

  // =====================
  // UPDATE MEDICINE
  // =====================
  updateMedicine(id: number, medicine: MedicineRequestModel): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.apiUrl}/${id}`, medicine);
  }

  // =====================
  // DELETE MEDICINE
  // =====================
  deleteMedicine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // =====================
  // SEARCH MEDICINES
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

  // ================================
  // REFRESH MEDICINES / RESET CACHE
  // ================================
  refreshMedicines(): Observable<Medicine[]> {
    this.medicineCache$ = undefined;
    return this.getAllMedicines();
  }

  clearCache(): void {
    this.medicineCache$ = undefined;
  }
}

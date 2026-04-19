import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

/* =======================
   DTO INTERFACES
======================= */

// Pharmacy basic details
export interface PharmacyDTO {
  pharmacyId: number;
  pharmacyName: string;
  pharmacyLocation: string;
}

// This was required when this page has medicines column in the old model of this page.
// export interface MedicineDTO {
//   medicineId: number;
//   medicineName: string;
// }

// Main response DTO
export interface PharmacyResponseDTO {
  id: PharmacyDTO;
  pharmacy: PharmacyDTO;
  location: PharmacyDTO;
  // medicine: MedicineDTO; // This was required when this page has medicines column in the old page of this.
  city: string;
  country: string;
  contactNumber: number | null;
  email: string;
  lastUpdated?: string;

  schedule?: PharmacySchedule[];
}

// Request DTO (for create/update)
export interface PharmacyRequestDTO {
  pharmacyName: string;
  pharmacyLocation: string;
  city: string;
  country: string;
  contactNumber: number | null;
  email: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface PharmacySchedule {
  name: string;
  open: boolean;
  openTime: string;
  closeTime: string;
}

/* =========
    SERVICE
   ========= */
@Injectable({
  providedIn: 'root',
})
export class PharmacySearchService {
  private baseUrl = `${environment.apiUrl}/pharmacies`; // change to deployed backend URL

  constructor(private http: HttpClient) {}

  /* =========================
      GET ALL (Non-paginated)
     ========================= */
  getAllPharmacies(): Observable<PharmacyResponseDTO[]> {
    return this.http.get<PharmacyResponseDTO[]>(`${this.baseUrl}/get-all`);
  }

  // This is for the old method of the search method.
  // 🔹 Search by pharmacy name
  // searchByPharmacy(pharmacyName: string): Observable<PharmacyResponseDTO[]> {
  //   const params = new HttpParams().set('pharmacyName', pharmacyName);
  //   return this.http.get<PharmacyResponseDTO[]>(
  //     // `${this.baseUrl}/search/pharmacy?pharmacyName=${pharmacyName}`, // Previous URL
  //     `${this.baseUrl}/search/pharmacy`,
  //     { params }, // New URL
  //   );
  // }

  // This is for the old method of the search method.
  // 🔹 Search by location
  // searchByLocation(location: string): Observable<PharmacyResponseDTO[]> {
  //   const params = new HttpParams().set('location', location);
  //   return this.http.get<PharmacyResponseDTO[]>(
  //     // `${this.baseUrl}/search/location?location=${location}`, // Previous URL
  //     `${this.baseUrl}/search/location`,
  //     { params }, // New URL
  //   );
  // }

  // This is for the old method of the search method.
  // 🔹 Search by city
  // searchByCity(city: string): Observable<PharmacyResponseDTO[]> {
  //   const params = new HttpParams().set('city', city);
  //   return this.http.get<PharmacyResponseDTO[]>(
  //     // `${this.baseUrl}/search/by-city?city=${city}` // Previous URL
  //     `${this.baseUrl}/search/city`,
  //     { params }, // New URL
  //   );
  // }

  /* ======================
      PAGINATION (Backend)
     ====================== */
  getPharmaciesPaginated(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<any>(this.baseUrl, { params });
  }

  /* =================
      COMBINED SEARCH
     ================= */
  searchPharmacies(
    location?: string,
    city?: string,
    pharmacyName?: string,
  ): Observable<PharmacyResponseDTO[]> {
    let params = new HttpParams();

    if (location) {
      params = params.set('location', location);
    }

    if (city) {
      params = params.set('city', city);
    }

    if (pharmacyName) {
      params = params.set('pharmacyName', pharmacyName);
    }

    return this.http.get<PharmacyResponseDTO[]>(`${this.baseUrl}/search`, { params });
  }

  /* =======================
     LEGACY SEARCH (Optional)
  ======================= */

  // This is the old method of frontend pagination slicing.
  // 🔹 Search by location
  // searchByLocation(location: string): Observable<PharmacyResponseDTO[]> {
  //   const params = new HttpParams().set('location', location);
  //
  //   return this.http.get<PharmacyResponseDTO[]>(`${this.baseUrl}/search/location`, { params });
  // }

  // This is the old method of frontend pagination slicing.
  // 🔹 Search by city
  // searchByCity(city: string): Observable<PharmacyResponseDTO[]> {
  //   const params = new HttpParams().set('city', city);
  //
  //   return this.http.get<PharmacyResponseDTO[]>(`${this.baseUrl}/search/city`, { params });
  // }

  // This is the old method of frontend pagination slicing.
  // 🔹 Search by pharmacy
  // searchByPharmacy(pharmacyName: string): Observable<PharmacyResponseDTO[]> {
  //   const params = new HttpParams().set('pharmacyName', pharmacyName);
  //
  //   return this.http.get<PharmacyResponseDTO[]>(`${this.baseUrl}/search/pharmacy`, { params });
  // }

  /* ===========================================
      AVAILABLE DATA 🔹 Get available medicines
     =========================================== */
  getAvailablePharmacies(): Observable<PharmacyResponseDTO[]> {
    return this.http.get<PharmacyResponseDTO[]>(`${this.baseUrl}/available`);
  }

  /* =====================================================
      AVAILABLE PAGINATED DATA 🔹 Get available medicines
     ===================================================== */
  getAvailablePharmaciesPaginated(
    page: number,
    size: number,
  ): Observable<PaginatedResponse<PharmacyResponseDTO>> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<PaginatedResponse<PharmacyResponseDTO>>(
      `${this.baseUrl}/paginated/available`,
      { params },
    );
  }

  /* =====================================
      CREATE 🔹 Create new pharmacy entry
     ===================================== */
  createPharmacy(data: PharmacyRequestDTO): Observable<PharmacyResponseDTO> {
    return this.http.post<PharmacyResponseDTO>(this.baseUrl, data);
  }

  /* =================================
      UPDATE 🔹 Update pharmacy entry
     ================================= */
  updatePharmacy(id: number, data: PharmacyResponseDTO): Observable<PharmacyResponseDTO> {
    return this.http.put<PharmacyResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  /* =================================
      DELETE 🔹 Delete pharmacy entry
     ================================= */
  deletePharmacy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // This is the old method of frontend pagination slicing.
  /* ====================================
     REFRESH 🔹 Refresh (same as getAll)
  ======================================= */
  // refreshPharmacies(): Observable<PharmacyResponseDTO[]> {
  //   return this.getAllPharmacies();
  // }

  /* =========================================
            NEW LOGIC (OPEN / CLOSED)
     ========================================= */

  //   Get current day name (e.g., Monday)
  getCurrentDayName(): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return days[new Date().getDay()];
  }

  //   Check if current time is between open and close time
  private isCurrentTimeBetween(openTime: string, closeTime: string): boolean {
    const now = new Date();

    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const openDate = new Date();
    openDate.setHours(openHour, openMinute, 0, 0);

    const closeDate = new Date();
    closeDate.setHours(closeHour, closeMinute, 0, 0);

    return now >= openDate && now <= closeDate;
  }

  //   Check if pharmacy is currently OPEN
  isPharmacyOpen(schedule?: PharmacySchedule[]): boolean {
    if (!schedule || schedule.length === 0) return false;

    const today = this.getCurrentDayName();

    const todaySchedule = schedule.find((day) => day.name === today);

    if (!todaySchedule || !todaySchedule.open) {
      return false;
    }

    return this.isCurrentTimeBetween(todaySchedule.openTime, todaySchedule.closeTime);
  }

  //  Return OPEN / CLOSED label
  getPharmacyStatus(schedule?: PharmacySchedule[]): 'OPEN' | 'CLOSED' {
    return this.isPharmacyOpen(schedule) ? 'OPEN' : 'CLOSED';
  }
}

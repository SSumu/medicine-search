import { Injectable } from '@angular/core';
import { HttpClient, /*HttpParams*/ } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Main response DTO
export interface PharmacyResponseDTO {
  id: number;
  name: string;
  location: string;
  city: string;
  country: string;
  contactNumber: string | null;
  email: string;
  available: boolean;
  lastUpdated?: string;

  schedule?: PharmacySchedule[];
}

// Request DTO (for create/update)
export interface PharmacyRequestDTO {
  pharmacyName: string;
  pharmacyLocation: string;
  city: string;
  country: string;
  contactNumber: string | null;
  email: string;
  available: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
}

export interface PharmacySchedule {
  day: string;
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
  getAllPharmacies(): Observable<PaginatedResponse<PharmacyResponseDTO>> {
    return this.http.get<PaginatedResponse<PharmacyResponseDTO>>(`${this.baseUrl}/get-all`);
  }

  /* =================
      COMBINED SEARCH
     ================= */
  searchPharmacies(
    location?: string,
    city?: string,
    pharmacyName?: string,
    page: number = 0,
    size: number = 5
  ): Observable<PaginatedResponse<PharmacyResponseDTO>> {

    let params: any = {
      page: page,
      size: size,
    };

    if (location?.trim()) params.location = location.trim();
    if (city?.trim()) params.city = city.trim();
    if (pharmacyName?.trim()) params.pharmacyName = pharmacyName.trim();

    return this.http.get<PaginatedResponse<PharmacyResponseDTO>>(`${this.baseUrl}/search`,
      {
        // params: {
        //   location: location || '',
        //   city: city || '',
        //   pharmacyName: pharmacyName || '',
        //   page: page.toString(),
        //   size: size.toString(),
        // },

        params
      }
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
  updatePharmacy(id: number, data: PharmacyRequestDTO): Observable<PharmacyResponseDTO> {
    return this.http.put<PharmacyResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  /* =================================
      DELETE 🔹 Delete pharmacy entry
     ================================= */
  deletePharmacy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

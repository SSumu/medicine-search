import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  PharmacySearchService,
  PharmacyResponseDTO,
  PaginatedResponse,
  PharmacySchedule,
  PharmacyRequestDTO,
} from './pharmacy-search.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, interval, Subject, Subscription } from 'rxjs';

// UI extended model (fixes missing properties like showSchedule, status)
type PharmacyUI = PharmacyResponseDTO & {
  showSchedule?: boolean;
  status?: 'OPEN' | 'CLOSED';
  closingSoon?: boolean;
};

@Component({
  selector: 'app-pharmacy-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pharmacy-search.component.html',
  styleUrls: ['pharmacy-search.component.scss'],
})
export class PharmacySearchComponent implements OnInit, OnDestroy {
  pharmacies: PharmacyUI[] = [];
  filteredPharmacies: PharmacyUI[] = [];

  // ✅ Selected pharmacy (FIXED TYPE SAFE)
  selectedPharmacy: PharmacyUI | null = null;

  // Search fields
  searchLocation = '';
  searchCity = '';
  searchPharmacy = '';

  // formData: any = {
  //   pharmacyName: '',
  //   pharmacyLocation: '',
  //   city: '',
  //   country: '',
  //   contactNumber: null,
  //   email: '',
  // };

  // editId!: number | null;

  isLoading = false;
  currentPage = 1;
  pageSize = 5;
  totalElements: number = 0; // 🔥 server-side total

  isAvailableMode = false; // ⭐ NEW FLAG

  // This is for the previous method condition.
  // 🔄 Auto refresh
  // autoRefreshInterval: any;

  filterMode: 'ALL' | 'AVAILABLE' | 'OPEN_NOW' = 'ALL';

  refreshSubscription!: Subscription;

  // 🔥 Debounce Subject
  private searchSubject: Subject<string> = new Subject();
  private searchSubscription!: Subscription;

  constructor(
      private pharmacyService: PharmacySearchService,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 🔥 Setup debounce
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(), // wait 500ms after typing
      )
      .subscribe(() => this.search()); // call your existing method

    // Optional: load initial data
    this.loadPharmacies();

    // This is for the previous method condition.
    // 🔄 AUTO REFRESH EVERY MINUTE
    // this.autoRefreshInterval = setInterval(() => {
    //   if (this.isAvailableMode) {
    //     this.loadAvailablePaginatedPharmacies();
    //   } else {
    //     this.loadPharmacies();
    //   }
    // }, 60000);

    // This is for the new method condition.
    // 🔄 AUTO REFRESH EVERY MINUTE
    // ✅ New auto refresh logic
    this.refreshSubscription = interval(60000).subscribe(() => {
      console.log('🔄 Auto refresh triggered');

      if (this.filterMode === 'OPEN_NOW' || this.filterMode === 'AVAILABLE') {
        this.applyFilter(); // UI-only refresh
      } else {
        this.loadPharmacies(); // full reload
      }
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    // This is for the previous method condition.
    // if (this.autoRefreshInterval) {
    //   clearInterval(this.autoRefreshInterval);
    // }

    // This is for the new method condition.
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // 🔥 This is triggered instead of calling search() directly
  onSearchInput(): void {
    // onSearchInput() is a service call.
    const combinedSearch = `${this.searchLocation}-${this.searchCity}-${this.searchPharmacy}`;
    this.searchSubject.next(combinedSearch);
  }

  /* ===============================
      SEARCH | ✅ SEARCH WITH API
  * ================================ */
  search(): void { // search() is a service call. (uses service properly)
    const location = this.searchLocation?.trim();
    const city = this.searchCity?.trim();
    const pharmacy = this.searchPharmacy?.trim();

    // NONE → If all fields empty → load all. If no filters → use pagination API
    if (!location && !city && !pharmacy) {
      this.loadPharmacies();
      return;
    }

    // This is the old search method using frontend.

    // ONLY LOCATION
    // if (location && !city && !pharmacy) {
    //   this.pharmacyService.searchByLocation(location).subscribe({
    //     next: (data) => (this.pharmacies = data ?? []),
    //     error: (err) => console.error('Location search failed', err),
    //   });
    //   return;
    // }
    //
    // // ONLY CITY
    // if (!location && city && !pharmacy) {
    //   this.pharmacyService.searchByCity(city).subscribe({
    //     next: (data) => (this.pharmacies = data ?? []),
    //     error: (err) => console.error('City search failed: ', err),
    //   });
    //   return;
    // }
    //
    // // ONLY PHARMACY
    // if (!location && !city && pharmacy) {
    //   this.pharmacyService.searchByPharmacy(pharmacy).subscribe({
    //     next: (data) => (this.pharmacies = data ?? []),
    //     error: (err) => console.error('Pharmacy search failed: ', err),
    //   });
    //   return;
    // }
    //
    // // LOCATION + CITY
    // if (location && city && !pharmacy) {
    //   this.pharmacyService.searchByLocation(location).subscribe({
    //     next: (data) => {
    //       this.pharmacies = (data ?? []).filter((item) =>
    //         item.city?.toLowerCase().includes(city.toLowerCase()),
    //       );
    //     },
    //     error: (err) => console.error('Location + city search failed: ', err),
    //   });
    //   return;
    // }
    //
    // // CITY + PHARMACY
    // if (!location && city && pharmacy) {
    //   this.pharmacyService.searchByCity(city).subscribe({
    //     next: (data) => {
    //       this.pharmacies = (data ?? []).filter((item) =>
    //         item.pharmacy?.pharmacyName?.toLowerCase().includes(pharmacy.toLowerCase()),
    //       );
    //     },
    //     error: (err) => console.error('City + Pharmacy search failed: ', err),
    //   });
    //   return;
    // }
    //
    // // LOCATION + PHARMACY
    // if (location && !city && pharmacy) {
    //   this.pharmacyService.searchByLocation(location).subscribe({
    //     next: (data) => {
    //       this.pharmacies = (data ?? []).filter((item) =>
    //         item.pharmacy?.pharmacyName?.toLowerCase().includes(pharmacy.toLowerCase()),
    //       );
    //     },
    //     error: (err) => console.error('Location + Pharmacy search failed: ', err),
    //   });
    //   return;
    // }
    //
    // // ALL THREE (LOCATION + CITY + PHARMACY)
    // if (location && city && pharmacy) {
    //   this.pharmacyService.searchByLocation(location).subscribe({
    //     next: (data) => {
    //       this.pharmacies = (data ?? [])
    //         .filter((item) => item.city?.toLowerCase().includes(city.toLowerCase()))
    //         .filter((item) =>
    //           item.pharmacy?.pharmacyName?.toLowerCase().includes(pharmacy.toLowerCase()),
    //         );
    //     },
    //     error: (err) => console.error('Combined search failed: ', err),
    //   });
    //   return;
    // }

    this.isLoading = true;

    this.pharmacyService.searchPharmacies(location, city, pharmacy).subscribe({
      next: (response) => {
        this.pharmacies = (response.content ?? []) as PharmacyUI[];
        // this.filteredPharmacies = data ?? []; // This is for the old conditions.
        this.applyFilter();
        this.totalElements = this.filteredPharmacies.length; // fallback if backend doesn't paginate search. Since search API is not paginated → use filtered length.
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Search failed', err);
        this.pharmacies = [];
        this.filteredPharmacies = [];
        this.isLoading = false;
      },
    });
  }

  // =====================================================
  // REFRESH PHARMACIES
  // =====================================================
  refreshPharmacies(): void {
    // refreshPharmacies() is a service call.

    // This is the previous method for the previous conditions.
    // this.pharmacyService.refreshPharmacies().subscribe({
    //   next: (data: PharmacyResponseDTO[]) => {
    //     this.pharmacies = data ?? [];
    //     this.filteredPharmacies = data ?? [];
    //   },
    //   error: (err) => {
    //     console.error('Failed to refresh pharmacies:', err);
    //   },
    // });

    // This is the new method. ( Backend pagination )
    this.currentPage = 1;
    this.loadPharmacies();
  }

  // ================================================================================================
  // LOAD ALL PHARMACIES ( no recursion | removed infinite loop ) | ✅ LOAD WITH PAGINATION API
  // ================================================================================================
  loadPharmacies(): void {
    // loadPharmacies() is a service call.
    this.isLoading = true;
    this.isAvailableMode = false;

    // This is the previous method for the previous conditions.
    // this.pharmacyService.getAllPharmacies().subscribe({
    //   next: (data: PharmacyResponseDTO[]) => {
    //     this.pharmacies = data ?? [];
    //     // this.loadPharmacies(); // ❌ REMOVE THIS. recursive call (infinite loop!)
    //     // this.refreshPharmacies(); // ⚠️ unnecessary duplicate call
    //     this.filteredPharmacies = data ?? [];
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error loading pharmacies:', err);
    //     this.pharmacies = [];
    //     this.filteredPharmacies = [];
    //     this.isLoading = false;
    //   },
    // });

    // This is the new method.
    this.pharmacyService.getPharmaciesPaginated(this.currentPage - 1, this.pageSize).subscribe({
      next: (response: PaginatedResponse<PharmacyResponseDTO>) => {
        // Adjust based on your backend response structure
        this.pharmacies = (response.content ?? []) /*response ??*/ as PharmacyUI[];
        this.applyFilter();
        // this.filteredPharmacies = this.pharmacies; // This is for the previous conditions.
        // this.totalElements = response.totalElements ?? this.pharmacies.length; // This is for the previous conditions.
        this.totalElements = response.totalElements ?? this.filteredPharmacies.length;
        // this.totalElements = response.totalElements ?? 0; // Always use backend total. This is another way of doing this.
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pharmacies:', err);
        this.pharmacies = [];
        this.filteredPharmacies = [];
        this.isLoading = false;
      },
    });
  }

  // ⭐ LOAD AVAILABLE PHARMACIES (PAGINATED)
  loadAvailablePaginatedPharmacies(): void {
    // loadAvailablePaginatedPharmacies() is a service call.
    this.isLoading = true;
    this.isAvailableMode = true;

    this.pharmacyService
      .getAvailablePharmaciesPaginated(this.currentPage - 1, this.pageSize)
      .subscribe({
        next: (response: PaginatedResponse<PharmacyResponseDTO>) => {
          this.pharmacies = (response.content ?? []) as PharmacyUI[];
          // this.filteredPharmacies = this.pharmacies; // This is for the previous method.
          this.applyFilter();
          this.totalElements = response.totalElements ?? 0;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading available pharmacies:', err);
          this.pharmacies = [];
          this.filteredPharmacies = [];
          this.isLoading = false;
        },
      });
  }

  // ==============================
  //        FILTER + STATUS
  // ==============================
  applyFilter(): void { // applyFilter() is a service call.

    // There was this.filteredPharmacies instead of current let updated.
    let updated = this.pharmacies.map((p) => ({
      ...p,
      status: this.pharmacyService.getPharmacyStatus(p.schedule),
      closingSoon: this.isClosingSoon(p.schedule),
      showSchedule: false, // UI toggle state
    }));

    if (this.filterMode === 'AVAILABLE') {
      updated = updated.filter(p => p.status === 'OPEN');

    }

    if (this.filterMode === 'OPEN_NOW') {
      updated = updated.filter(p => this.pharmacyService.isPharmacyOpen(p.schedule)
      );
    }

    this.filteredPharmacies = updated;
  }

  /* ============================
            FILTER SWITCH
     ============================ */
  setFilterMode(mode: 'ALL' | 'AVAILABLE' | 'OPEN_NOW'): void {
    this.filterMode = mode;
    this.currentPage = 1;

    if (mode === 'AVAILABLE') {
      this.loadAvailablePaginatedPharmacies();
    } else {
      this.loadPharmacies();
    }
  }

  // ==================================
  //          STATUS LOGIC
  // ==================================
  // ✅ FIXED DAY MAPPING
  getCurrentDayName(): string {
    // getCurrentDayName() is a service call.
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
      new Date().getDay()
    ];
  }

  // ==============================
  //            TIME LOGIC
  // ==============================
  isPharmacyOpen(schedule?: PharmacySchedule[]): boolean { // isPharmacyOpen() is a service call.
    if (!schedule) return false;

    const today = this.getCurrentDayName();
    const todaySchedule = schedule.find((d) => d.day === today);

    if (!todaySchedule || !todaySchedule.open) return false;

    return this.isTimeBetween(todaySchedule.openTime, todaySchedule.closeTime);
  }

  // =================================
  //      🔥 FIXED OVERNIGHT LOGIC
  // =================================
  // ✅ FIXED TIME LOGIC
  isTimeBetween(openTime: string, closeTime: string): boolean { // isTimeBetween() is a service call.
    const now = new Date();

    const open = this.convertToToday(openTime);
    const close = this.convertToToday(closeTime);

    // Overnight case (e.g., 22:00 → 06:00)
    if (close < open) {
      return now >= open || now <= close;
    }

    // normal case
    return now >= open && now <= close;
  }

  // ==============================
  //      CLOSING SOON
  // ==============================
  isClosingSoon(schedule?: PharmacySchedule[]): boolean { // isClosingSoon() is a service call.
    if (!schedule) return false;

    const today = this.pharmacyService.getCurrentDayName();
    const todaySchedule = schedule.find((d) => d.day === today);

    if (!todaySchedule || !todaySchedule.open) return false;

    if (!this.pharmacyService.isPharmacyOpen(schedule)) return false;

    const now = new Date();
    let close = this.convertToToday(todaySchedule.closeTime);

    let diff = (close.getTime() - now.getTime()) / (1000 * 60);

    if (diff < 0) diff += 24 * 60;

    return diff <= 60;
  }

  // ==============================
  //      PHARMACY STATUS
  // ==============================
  getPharmacyStatus(schedule?: PharmacySchedule[]): 'OPEN' | 'CLOSED' { // getPharmacyStatus() is a service call.
    return this.isPharmacyOpen(schedule) ? 'OPEN' : 'CLOSED';
  }

  /* ==============================
            TOGGLE SCHEDULE
     ============================== */
  toggleSchedule(item: PharmacyUI): void { // toggleSchedule() is a service call.
    item.showSchedule = !item.showSchedule;
  }

  // ==============================
  //        CONVERSION
  // ==============================
  convertToToday(time: string): Date { // convertToToday() is a service call.
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  // ===============================================================
  //   📦 PAGINATION | LOADING SPINNER | Server pagination is used
  // ===============================================================
  get paginatedPharmacies() { // paginatedPharmacies() is a service call.
    // This is the frontend pagination using slicing. Old method.
    // const start = (this.currentPage - 1) * this.pageSize;
    // return this.pharmacies.slice(start, start + this.pageSize);

    // This is the backend pagination. Old method.
    // return this.pharmacies;

    // This is new method.
    return this.filteredPharmacies;
  }

  get totalPages() { // totalPages() is a service call.
    // This is frontend pagination using slicing. Old method
    // return Math.ceil(this.pharmacies.length / this.pageSize);

    // This is the backend pagination. New method.
    return Math.ceil(this.totalElements / this.pageSize);
  }

  // 🔄 PAGE CHANGE (IMPORTANT)
  // changePage() method does more than just update the page.
  changePage(page: number): void { // changePage() is a service call.
    if (page < 1) return;

    this.currentPage = page;

    const hasSearch =
      this.searchLocation.trim() || this.searchCity.trim() || this.searchPharmacy.trim();

    // If searching → re-search (no backend pagination for search)
    if (hasSearch)
      this.search(); // 🔍 keeps search context/. Search API is not paginated → reload search
    else this.isAvailableMode ? this.loadAvailablePaginatedPharmacies() : this.loadPharmacies(); // ⭐ loadAvailablePaginatedPharmacies() is IMPORTANT. loadPharmacies() is for 📄 normal pagination.
  }

  // =============================
  //  🟢 SWITCH TO AVAILABLE MODE
  // =============================
  showAvailableOnly(): void {
    // showAvailableOnly() is a service call.
    this.currentPage = 1;
    this.loadAvailablePaginatedPharmacies();
  }

  // =======================================================================
  // ✅ SELECTED PHARMACY | 📝 SELECT / EDIT / DELETE | CRUD | FIXED TYPING
  // =======================================================================
  selectPharmacy(item: PharmacyUI) { // selectPharmacy() is a service call.
    this.selectedPharmacy = item;
  }

  // ================================
  //          EDIT PHARMACY
  // ================================
  editPharmacy(item: PharmacyUI) {
    // editPharmacy() is a service call.
    // this.editId = item.pharmacy.pharmacyId;

    // Also set selectedPharmacy for editing. clone object for editing
    this.selectedPharmacy = { ...item };

    // this.formData = {
    //   pharmacyName: item.pharmacy.pharmacyName,
    //   pharmacyLocation: item.pharmacy.pharmacyLocation,
    //   city: item.city,
    //   country: item.country,
    //   contactNumber: item.contactNumber,
    //   email: item.email,
    // };
  }

  // ===================================
  //          UPDATE PHARMACIES
  // ===================================
  updatePharmacy(): void { // updatePharmacy() is a service call.
    if (!this.selectedPharmacy) return;

    const payload: PharmacyRequestDTO = {
      pharmacyName: this.selectedPharmacy.name,
      pharmacyLocation: this.selectedPharmacy.location,
      city: this.selectedPharmacy.city,
      country: this.selectedPharmacy.country,
      contactNumber: this.selectedPharmacy.contactNumber,
      email: this.selectedPharmacy.email,
      available: this.selectedPharmacy.available ?? true,
    }

    this.pharmacyService
      .updatePharmacy(this.selectedPharmacy.id, payload)
      .subscribe({
        next: () => {
          this.loadPharmacies();
          this.selectedPharmacy = null;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to update pharmacies:', err),
      });
  }

  // =====================================================
  // DELETE PHARMACIES
  // =====================================================
  deletePharmacy(id: number): void { // deletePharmacy() is a service call.
    this.pharmacyService.deletePharmacy(id).subscribe({
      next: () => this.loadPharmacies(),
      error: (err) => console.error('Failed to delete pharmacies:', err),
    });
  }
}

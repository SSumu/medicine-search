import { Component } from '@angular/core';
import { PharmacyResponseDTO, PharmacySchedule, PharmacySearchService } from '../../core/services/pharmacy-search/pharmacy-search.service';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, Subject, Subscription, switchMap } from 'rxjs';

type PharmacyUI = PharmacyResponseDTO & {
  showSchedule?: boolean;
  status?: 'OPEN' | 'CLOSED';
  closingSoon?: boolean;
};

@Component({
  selector: 'app-pharmacy-search-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pharmacy-search-user.component.html',
  styleUrl: './pharmacy-search-user.component.scss',
})
export class PharmacySearchUserComponent {
  pharmacies: PharmacyUI[] = [];
  filteredPharmacies: PharmacyUI[] = [];

  searchLocation = '';
  searchCity = '';
  searchPharmacy = '';

  isLoading = false;

  currentPage = 0; // UI (0-based)
  pageSize = 5;
  totalElements = 0;
  totalPages = 0;

  filterMode: 'ALL' | 'AVAILABLE' | 'OPEN_NOW' = 'ALL';

  private userSearchSubject = new Subject<void>();
  private userSearchSubscription!: Subscription;

  constructor(private pharmacyService: PharmacySearchService) {}

  ngOnInit(): void {
    this.userSetupSearch();
    this.triggerSearch(); // ✅ initial load
  }

  userSetupSearch(): void {
    this.userSearchSubscription = this.userSearchSubject
      .pipe(
        debounceTime(300),

        // ✅ Build request key
        switchMap(() => {
          const requestKeyForUser = JSON.stringify({
            location: this.searchLocation,
            city: this.searchCity,
            pharmacy: this.searchPharmacy,
            page: this.currentPage,
            size: this.pageSize,
          });

          return of(requestKeyForUser);
        }),

        // ✅ Prevent duplicate requests
        distinctUntilChanged(),

        // ✅ Call API only if changed
        switchMap(() => {
          let pageLoaderTimer: any;

          // ⏳ show loader ONLY if slow
          pageLoaderTimer = setTimeout(() => {
            this.isLoading = true;
          }, 300); // show only if request takes > 300ms

          return this.pharmacyService
            .searchPharmacies(
              // this.searchLocation.trim(), // This is for the old method.
              // this.searchCity.trim(), // This is for the old method.
              // this.searchPharmacy.trim(), // This is for the old method.
              this.searchLocation,
              this.searchCity,
              this.searchPharmacy,
              this.currentPage, // backend is 0-based
              this.pageSize,
            )
            .pipe(
              catchError(() =>
                of({
                  content: [],
                  totalElements: 0,
                  totalPages: 0,
                  page: 0,
                }),
              ),
              finalize(() => {
                clearTimeout(pageLoaderTimer); // 🧹 stop timer
                this.isLoading = false; // ✅ALWAYS STOP LOADING | ✅ hide loader
              }),
            );
        }),
      )
      .subscribe((res: any) => {
        console.log('Backend Page:', res.page);

        // ✅ Sync page with backend
        this.currentPage = res.page ?? this.currentPage;

        // ✅ SAFE MAPPING
        this.pharmacies = (res.content || []).map((p: any) => ({
          ...p,
          showSchedule: false,
          status: 'CLOSED',
          closingSoon: false,
        }));
        // this.filteredPharmacies = [...this.pharmacies];

        this.totalElements = res.totalElements || 0;
        this.totalPages = res.totalPages || 0;

        console.log('UI Page (after update):', this.currentPage);

        this.applyUserFilter(); // ✅ APPLY AFTER SAFE MAP
      });
  }

  ngOnDestroy(): void {
    this.userSearchSubscription?.unsubscribe();
    // this.refreshSubscription?.unsubscribe();
  }

  // SEARCH
  onSearchInput(): void {
    if (this.currentPage !== 0) {
      this.currentPage = 0; // ✅ reset to first page when searching
    }
    this.triggerSearch();
    // this.searchSubject.next();
  }

  triggerSearch(): void {
    // const key = `${this.searchLocation} - ${this.searchCity} - ${this.searchPharmacy} - ${this.currentPage}`;
    this.userSearchSubject.next();
  }

  resetFilter(): void {
    this.searchLocation = '';
    this.searchCity = '';
    this.searchPharmacy = '';
    this.filterMode = 'ALL';
    this.currentPage = 0;

    this.triggerSearch();
  }

  // FILTER LOGIC
  applyUserFilter(): void {
    let userTemp: PharmacyUI[] = this.pharmacies.map((p) => {
      const isOpen = this.isPharmacyOpenOrNot(p.schedule);

      // const status: 'OPEN' | 'CLOSED' = isOpen ? 'OPEN' : 'CLOSED';

      return {
        ...p,
        status: isOpen ? 'OPEN' : 'CLOSED',
        closingSoon: isOpen && this.isPharmacyClosingSoon(p.schedule),
      };
    });

    // ✅ FILTER FIX
    if (this.filterMode === 'AVAILABLE') {
      userTemp = userTemp.filter((p) => p.available);
    }

    if (this.filterMode === 'OPEN_NOW') {
      userTemp = userTemp.filter((p) => p.status === 'OPEN');
    }

    // ✅ ALWAYS ASSIGN
    this.filteredPharmacies = userTemp;
  }

  setFilterMode(mode: 'ALL' | 'AVAILABLE' | 'OPEN_NOW'): void {
    this.filterMode = mode;
    this.applyUserFilter();
  }

  // ⏰ STATUS LOGIC
  isPharmacyOpenOrNot(scheduleDaysAndTimes?: PharmacySchedule[]): boolean {
    // if (!schedule || schedule.length === 0) return false;
    if (!scheduleDaysAndTimes?.length) return false;

    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' });

    const todayScheduleTimes = scheduleDaysAndTimes.find((s) => s.day === today && s.open);
    if (!todayScheduleTimes) return false;

    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = todayScheduleTimes.openTime.split(':').map(Number);
    const [closeH, closeM] = todayScheduleTimes.closeTime.split(':').map(Number);

    const openTime = openH * 60 + openM;
    const closeTime = closeH * 60 + closeM;

    return currentTime >= openTime && currentTime <= closeTime;
  }

  isPharmacyClosingSoon(scheduleTimes?: PharmacySchedule[]): boolean {
    if (!scheduleTimes) return false;

    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' });

    const todaySchedule = scheduleTimes.find((d) => d.day === today && d.open);
    if (!todaySchedule) return false;

    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [closeH, closeM] = todaySchedule.closeTime.split(':').map(Number);
    const closeTime = closeH * 60 + closeM;

    return closeTime - currentTime <= 30;
  }

  // get totalPages(): number {
  //   return Math.ceil(this.totalElements / this.pageSize);
  // }

  // 📄 PAGINATION
  changePage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;

    this.currentPage = page; // ✅ UI controls page
    this.triggerSearch();
  }

  nextPage(): void {
    // if (this.currentPage < this.totalPages - 1) {
    //   this.changePage(this.currentPage + 1);
    // }

    this.changePage(this.currentPage + 1);
  }

  previousPage(): void {
    // if (this.currentPage > 0) {
    //   this.changePage(this.currentPage - 1);
    // }

    this.changePage(this.currentPage - 1);
  }

  get paginatedPharmacies(): PharmacyUI[] {
    // const start = (this.currentPage - 1) * this.pageSize;
    // return this.filteredPharmacies.slice(start, start + this.pageSize);
    return this.filteredPharmacies;
  }

  // 🎯🧩 UI ACTIONS
  toggleSchedule(pharmacy: PharmacyUI): void {
    pharmacy.showSchedule = !pharmacy.showSchedule;
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  PharmacySearchService,
  PharmacyResponseDTO,
  PaginatedResponse,
  PharmacySchedule,
  PharmacyRequestDTO,
} from './pharmacy-search.service';
import { FormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  interval,
  of,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';

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
  styleUrls: ['./pharmacy-search.component.scss'],
})
export class PharmacySearchComponent implements OnInit, OnDestroy {
  pharmacies: PharmacyUI[] = [];
  filteredPharmacies: PharmacyUI[] = [];
  selectedPharmacy: PharmacyUI | null = null;

  searchLocation = '';
  searchCity = '';
  searchPharmacy = '';

  isLoading = false;

  currentPage = 0; // UI (0-based)
  pageSize = 5;
  totalElements = 0;
  totalPages = 0;

  filterMode: 'ALL' | 'AVAILABLE' | 'OPEN_NOW' = 'ALL';

  editingSchedulePharmacy: PharmacyUI | null = null;

  private searchSubject = new Subject<void>();
  private searchSubscription!: Subscription;
  // private refreshSubscription!: Subscription;

  constructor(private pharmacyService: PharmacySearchService) {}

  ngOnInit(): void {
    this.setupSearch();
    this.triggerSearch(); // ✅ initial load
  }

  setupSearch(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),

        // ✅ Build request key
        switchMap(() => {
          const requestKey = JSON.stringify({
            location: this.searchLocation,
            city: this.searchCity,
            pharmacy: this.searchPharmacy,
            page: this.currentPage,
            size: this.pageSize,
          });

          return of(requestKey);
        }),

        // ✅ Prevent duplicate requests
        distinctUntilChanged(),

        // ✅ Call API only if changed
        switchMap(() => {
          let loaderTimer: any;

          // ⏳ show loader ONLY if slow
          loaderTimer = setTimeout(() => {
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
                clearTimeout(loaderTimer); // 🧹 stop timer
                this.isLoading = false; // ✅ALWAYS STOP LOADING | ✅ hide loader
              }),
            );
        }),
      )
      .subscribe((response: any) => {
        console.log('Backend Page:', response.page);

        // ✅ Sync page with backend
        this.currentPage = response.page ?? this.currentPage;

        // ✅ SAFE MAPPING
        this.pharmacies = (response.content || []).map((p: any) => ({
          ...p,
          showSchedule: false,
          status: 'CLOSED',
          closingSoon: false,
        }));
        // this.filteredPharmacies = [...this.pharmacies];

        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;

        console.log('UI Page (after update):', this.currentPage);

        this.applyFilter(); // ✅ APPLY AFTER SAFE MAP
      });

    // ✅ ONLY ONE TRIGGER
    // this.triggerSearch();

    // AUTO REFRESH STATUS ONLY
    // this.refreshSubscription = interval(60000).subscribe(() => {
    //   // console.log('🔄 Auto refresh triggered');
    //   this.updateStatusesOnly();
    // });
  }

  // ✅ FIRST LOAD FIX
  // loadPharmacies(): void {
  //   this.isLoading = true;
  //
  //   this.pharmacyService.searchPharmacies(
  //     '', '', '', 0, this.pageSize
  //   ).pipe(
  //     finalize(() => this.isLoading = false)
  //   ).subscribe(response => {
  //
  //     this.pharmacies = (response.content || []).map(p => ({
  //       ...p,
  //       showSchedule: false,
  //       status: "CLOSED",
  //       closingSoon: false
  //     }));
  //
  //     this.totalElements = response.totalElements || 0;
  //     this.totalPages = response.totalPages || 0;
  //
  //     this.applyFilter();
  //   });
  // }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
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
    this.searchSubject.next();
  }

  resetFilter(): void {
    this.searchLocation = '';
    this.searchCity = '';
    this.searchPharmacy = '';
    this.filterMode = 'ALL';
    this.currentPage = 0;

    this.triggerSearch();

    // this.loadPharmacies(); // ✅ reload clean
  }

  // applyFilter(): void {
  //   this.filteredPharmacies = this.pharmacies
  //     .map((p) => {
  //       const status: 'OPEN' | 'CLOSED' = this.isPharmacyOpen(p.schedule) ? 'OPEN' : 'CLOSED';
  //
  //       return {
  //         ...p,
  //         status,
  //         closingSoon: status === 'OPEN' && this.isClosingSoon(p.schedule),
  //         // showSchedule: p.showSchedule ?? false,
  //       };
  //     })
  //     .filter((p) => {
  //       if (this.filterMode === 'OPEN_NOW') return p.status === 'OPEN';
  //       if (this.filterMode === 'AVAILABLE') return p.available;
  //       return true;
  //     });
  // }

  // FILTER LOGIC
  applyFilter(): void {
    let temp: PharmacyUI[] = this.pharmacies.map((p) => {
      const isOpen = this.isPharmacyOpen(p.schedule);

      // const status: 'OPEN' | 'CLOSED' = isOpen ? 'OPEN' : 'CLOSED';

      return {
        ...p,
        status: isOpen ? 'OPEN' : 'CLOSED',
        closingSoon: isOpen && this.isClosingSoon(p.schedule),
      };
    });

    // ✅ FILTER FIX
    if (this.filterMode === 'AVAILABLE') {
      temp = temp.filter((p) => p.available);
    }

    if (this.filterMode === 'OPEN_NOW') {
      temp = temp.filter((p) => p.status === 'OPEN');
    }

    // ✅ ALWAYS ASSIGN
    this.filteredPharmacies = temp;
  }

  setFilterMode(mode: 'ALL' | 'AVAILABLE' | 'OPEN_NOW'): void {
    this.filterMode = mode;
    this.applyFilter();

    // if (mode === 'ALL') {
    //   this.currentPage = 1;
    //   this.triggerSearch(); // reload all from backend
    // } else {
    //   this.applyFilter();
    // }
  }

  // updateStatusesOnly(): void {
  //   this.filteredPharmacies.forEach((p) => {
  //     const status = this.isPharmacyOpen(p.schedule) ? 'OPEN' : 'CLOSED';
  //     p.status = status;
  //     p.closingSoon = status === 'OPEN' && this.isClosingSoon(p.schedule);
  //   });
  // }

  // isPharmacyOpen(schedule?: PharmacySchedule[]): boolean {
  //   if (!schedule) return false;
  //
  //   const today = this.getCurrentDayName();
  //   const todaySchedule = schedule.find((d) => d.day === today);
  //
  //   if (!todaySchedule || !todaySchedule.open) return false;
  //
  //   return this.isTimeBetween(todaySchedule.openTime, todaySchedule.closeTime);
  // }
  //
  // isTimeBetween(openTime: string, closeTime: string): boolean {
  //   const now = new Date();
  //   const open = this.convertToToday(openTime);
  //   const close = this.convertToToday(closeTime);
  //
  //   if (close < open) return now >= open || now <= close;
  //
  //   return now >= open && now <= close;
  // }
  //
  // isClosingSoon(schedule?: PharmacySchedule[]): boolean {
  //   if (!schedule) return false;
  //
  //   const today = this.getCurrentDayName();
  //   const todaySchedule = schedule.find((d) => d.day === today);
  //
  //   if (!todaySchedule || !todaySchedule.open) return false;
  //   if (!this.isPharmacyOpen(schedule)) return false;
  //
  //   const now = new Date();
  //   let close = this.convertToToday(todaySchedule.closeTime);
  //
  //   let diff = (close.getTime() - now.getTime()) / (1000 * 60);
  //   if (diff < 0) diff += 24 * 60;
  //
  //   return diff <= 60;
  // }
  //
  // convertToToday(time: string): Date {
  //   const [h, m] = time.split(':').map(Number);
  //   const d = new Date();
  //   d.setHours(h, m, 0, 0);
  //   return d;
  // }

  // getCurrentDayName(): string {
  //   return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
  //     new Date().getDay()
  //   ];
  // }

  // ⏰ STATUS LOGIC
  isPharmacyOpen(schedule?: PharmacySchedule[]): boolean {
    // if (!schedule || schedule.length === 0) return false;
    if (!schedule?.length) return false;

    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' });

    const todaySchedule = schedule.find((s) => s.day === today && s.open);
    if (!todaySchedule) return false;

    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = todaySchedule.openTime.split(':').map(Number);
    const [closeH, closeM] = todaySchedule.closeTime.split(':').map(Number);

    const openTime = openH * 60 + openM;
    const closeTime = closeH * 60 + closeM;

    return currentTime >= openTime && currentTime <= closeTime;
  }

  isClosingSoon(schedule?: PharmacySchedule[]): boolean {
    if (!schedule) return false;

    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' });

    const todaySchedule = schedule.find((d) => d.day === today && d.open);
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

  editPharmacy(pharmacy: PharmacyUI): void {
    this.selectedPharmacy = { ...pharmacy };
  }

  editSchedule(pharmacy: PharmacyUI): void {
    this.editingSchedulePharmacy = {
      ...pharmacy,
      schedule: pharmacy.schedule ? [...pharmacy.schedule] : []
    };
  }

  updateSchedule(): void {
    if (!this.editingSchedulePharmacy) return;

    this.pharmacyService.updateSchedule(
      this.editingSchedulePharmacy.id,
      this.editingSchedulePharmacy.schedule || []
    ).subscribe(() => {
      this.editingSchedulePharmacy = null;
      this.triggerSearch();
    });
  }

  updatePharmacy(): void {
    if (!this.selectedPharmacy) return;

    const payload: PharmacyRequestDTO = {
      pharmacyName: this.selectedPharmacy.name,
      pharmacyLocation: this.selectedPharmacy.location,
      city: this.selectedPharmacy.city,
      country: this.selectedPharmacy.country,
      contactNumber: this.selectedPharmacy.contactNumber,
      email: this.selectedPharmacy.email,
      available: this.selectedPharmacy.available ?? true,
    };

    this.pharmacyService.updatePharmacy(this.selectedPharmacy.id, payload).subscribe(() => {
      // next: () => {
      //   this.selectedPharmacy = null;
      //   this.triggerSearch();
      // },
      // error: (err) => console.error('Failed to update pharmacies:', err),

      this.selectedPharmacy = null;
      this.triggerSearch();
    });
  }

  deletePharmacy(id: number): void {
    // this.pharmacyService.deletePharmacy(id).subscribe({
    //   next: () => this.triggerSearch(),
    //   error: (err) => console.error('Failed to delete pharmacies:', err),
    // });

    this.pharmacyService.deletePharmacy(id).subscribe(() => {
      // ✅ handle last item delete
      if (this.pharmacies.length === 1 && this.currentPage > 0) {
        this.currentPage--;
      }
      this.triggerSearch();
    });
  }
}

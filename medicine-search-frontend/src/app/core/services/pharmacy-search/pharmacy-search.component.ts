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

  currentPage = 1;
  pageSize = 5;
  totalElements = 0;

  filterMode: 'ALL' | 'AVAILABLE' | 'OPEN_NOW' = 'ALL';

  private searchSubject = new Subject<void>();
  private searchSubscription!: Subscription;
  private refreshSubscription!: Subscription;

  constructor(private pharmacyService: PharmacySearchService) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),

        switchMap(() => {
          this.isLoading = true;

          return this.pharmacyService
            .searchPharmacies(
              this.searchLocation.trim(),
              this.searchCity.trim(),
              this.searchPharmacy.trim(),
              this.currentPage - 1,
              this.pageSize,
            )
            .pipe(
              catchError((/*err*/) =>
                // console.error('API ERROR:', err);
                of<PaginatedResponse<PharmacyResponseDTO>>({
                  content: [],
                  totalElements: 0,
                  totalPages: 0,
                  currentPage: 0,
                }),
              ),
              finalize(() => {
                this.isLoading = false; // ✅ ALWAYS STOP LOADING
              }),
            );
        }),
      )
      .subscribe((response: PaginatedResponse<PharmacyResponseDTO>) => {
          this.pharmacies = (response.content ?? []) as PharmacyUI[];
          this.totalElements = response.totalElements ?? 0;
          this.applyFilter();
      });

    // ✅ ONLY ONE TRIGGER
    this.triggerSearch();

    // AUTO REFRESH STATUS ONLY
    this.refreshSubscription = interval(60000).subscribe(() => {
      // console.log('🔄 Auto refresh triggered');
      this.updateStatusesOnly();
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.refreshSubscription?.unsubscribe();
  }

  // SEARCH
  onSearchInput(): void {
    this.currentPage = 1;
    this.triggerSearch();
  }

  triggerSearch(): void {
    // this.isLoading = true;
    // const key = `${this.searchLocation} - ${this.searchCity} - ${this.searchPharmacy} - ${this.currentPage}`;
    this.searchSubject.next();
  }

  resetFilter(): void {
    this.searchLocation = '';
    this.searchCity = '';
    this.searchPharmacy = '';
    this.filterMode = 'ALL';
    this.currentPage = 1;
    this.triggerSearch();
  }

  applyFilter(): void {
    this.filteredPharmacies = this.pharmacies
    .map((p) => {
      const status: 'OPEN' | 'CLOSED' = this.isPharmacyOpen(p.schedule) ? 'OPEN' : 'CLOSED';

      return {
        ...p,
        status,
        closingSoon: status === 'OPEN' && this.isClosingSoon(p.schedule),
        // showSchedule: p.showSchedule ?? false,
      };
    })
    .filter((p) => {
      if (this.filterMode === 'OPEN_NOW') return p.status === 'OPEN';
      if (this.filterMode === 'AVAILABLE') return p.available;
      return true;
    });
  }

  setFilterMode(mode: 'ALL' | 'AVAILABLE' | 'OPEN_NOW'): void {
    this.filterMode = mode;

    if (mode === 'ALL') {
      this.currentPage = 1;
      this.triggerSearch(); // reload all from backend
    } else {
      this.applyFilter();
    }
  }

  updateStatusesOnly(): void {
    this.filteredPharmacies.forEach((p) => {
      const status = this.isPharmacyOpen(p.schedule) ? 'OPEN' : 'CLOSED';
      p.status = status;
      p.closingSoon = status === 'OPEN' && this.isClosingSoon(p.schedule);
    });
  }

  isPharmacyOpen(schedule?: PharmacySchedule[]): boolean {
    if (!schedule) return false;

    const today = this.getCurrentDayName();
    const todaySchedule = schedule.find((d) => d.day === today);

    if (!todaySchedule || !todaySchedule.open) return false;

    return this.isTimeBetween(todaySchedule.openTime, todaySchedule.closeTime);
  }

  isTimeBetween(openTime: string, closeTime: string): boolean {
    const now = new Date();
    const open = this.convertToToday(openTime);
    const close = this.convertToToday(closeTime);

    if (close < open) return now >= open || now <= close;

    return now >= open && now <= close;
  }

  isClosingSoon(schedule?: PharmacySchedule[]): boolean {
    if (!schedule) return false;

    const today = this.getCurrentDayName();
    const todaySchedule = schedule.find((d) => d.day === today);

    if (!todaySchedule || !todaySchedule.open) return false;
    if (!this.isPharmacyOpen(schedule)) return false;

    const now = new Date();
    let close = this.convertToToday(todaySchedule.closeTime);

    let diff = (close.getTime() - now.getTime()) / (1000 * 60);
    if (diff < 0) diff += 24 * 60;

    return diff <= 60;
  }

  convertToToday(time: string): Date {
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  getCurrentDayName(): string {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
      new Date().getDay()
    ];
  }

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.triggerSearch();
  }

  get paginatedPharmacies(): PharmacyUI[] {
    // const start = (this.currentPage - 1) * this.pageSize;
    // return this.filteredPharmacies.slice(start, start + this.pageSize);
    return this.filteredPharmacies;
  }

  // UI ACTIONS
  toggleSchedule(pharmacy: PharmacyUI): void {
    pharmacy.showSchedule = !pharmacy.showSchedule;
  }

  selectPharmacy(pharmacy: PharmacyUI): void {
    this.selectedPharmacy = { ...pharmacy };
  }

  editPharmacy(pharmacy: PharmacyUI): void {
    this.selectedPharmacy = { ...pharmacy };
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

    this.pharmacyService.updatePharmacy(this.selectedPharmacy.id, payload).subscribe({
      next: () => {
        this.selectedPharmacy = null;
        this.triggerSearch();
      },
      error: (err) => console.error('Failed to update pharmacies:', err),
    });
  }

  deletePharmacy(id: number): void {
    this.pharmacyService.deletePharmacy(id).subscribe({
      next: () => this.triggerSearch(),
      error: (err) => console.error('Failed to delete pharmacies:', err),
    });
  }
}

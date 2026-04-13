import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Medicine} from '../../models/medicine/medicine.model';
import {MedicineService} from '../../core/services/medicine/medicine.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-medicine-search',
  standalone: true,
  templateUrl: 'medicine-search.component.html',
  styleUrls: ['medicine-search.component.scss'],
  imports: [FormsModule],
})
export class MedicineSearchComponent implements OnInit {
  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] | undefined;
  searchText: string = '';

  selectedMedicine: Medicine | null = null;
  newMedicineForSearch: Medicine = {
    medicineId: 0,
    medicineName: '',
    manufacturer: '',
    quantity: null,
    price: null,
    description: '',
  };

  isLoading = false;
  currentPage = 1;
  pageSize = 5;

  // TEMP PAGE HOLDER
  private tempPage: number = 1;

  // Store page before search
  private previousPageBeforeSearch: number = 1;

  // store correct page of search result
  private searchResultPage: number = 1;

  constructor(
    private medicineService: MedicineService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const nav = history.state;

    // Putting this in here caused for the recursion on the console of the backend.
    // this.refreshMedicines();

    if (nav && nav.medicine) {
      this.selectedMedicine = nav.medicine;
    }

    // ✅ Only ONE initial API call
    this.loadMedicines();
  }

  // =====================================================
  // 🔥 FIND PAGE WHERE SEARCH RESULT EXISTS
  // =====================================================
  private findPageForSearchResult(): number {
    if (!this.filteredMedicines || this.filteredMedicines.length === 0) {
      return 1;
    }

    // If only one result → calculate its page index from full list
    const result = this.filteredMedicines[0];

    const index = this.medicines.findIndex(
      (m) => m.medicineId === result.medicineId,
    );

    if (index === -1) return  1;

    return Math.floor(index / this.pageSize) + 1;
  }

  // =====================================================
  // SEARCH MEDICINES
  // =====================================================
  search(): void {
    const keyword = this.searchText.trim();

    if (!keyword) return; // ✅ Do nothing if empty

    // ✅ SAVE current page before resetting. STILL OK (redundant but safe)
    this.previousPageBeforeSearch = this.currentPage;

    // 🔥 RESET PAGINATION HERE
    this.currentPage = 1;

    if (!keyword) {
      this.filteredMedicines = [...this.medicines];
      this.cdr.detectChanges();
      return;
    }

    this.medicineService.searchMedicines(keyword).subscribe({
      next: (data: Medicine[]) => {
        this.filteredMedicines = data ?? [];

        // ✅ FIND CORRECT PAGE OF RESULT
        this.searchResultPage = this.findPageForSearchResult();

        // 🔥 RESET PAGINATION AGAIN AFTER DATA LOAD
        this.currentPage = 1;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Search error:', err);
        this.filteredMedicines = [];

        // 🔥 RESET PAGINATION ON ERROR TOO
        this.currentPage = 1;

        this.cdr.detectChanges();
      },
    });
  }

  // =====================================================
  // REFRESH MEDICINES
  // =====================================================
  refreshMedicines(): void {
    if (!this.searchText.trim()) return; // ✅ Do nothing if input empty

    // ✅ USE previous page instead of currentPage (which became 1 after search). USE search result page instead of previous page
    this.tempPage = this.searchResultPage || this.previousPageBeforeSearch;

    this.medicineService.refreshMedicines().subscribe({
      next: (data: Medicine[]) => {
        this.medicines = data ?? [];
        this.filteredMedicines = data ?? [];
        this.cdr.detectChanges();

        // ✅ RESTORE PAGE SAFELY. Restore correct page. Wait until Angular recalculates totalPages
        setTimeout(() => {
          this.currentPage = Math.min(this.tempPage, this.totalPages || 1);
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Refresh medicines error:', err);
        this.cdr.detectChanges();
      },
    });
  }

  // =====================================================
  // LOADING SPINNER
  // =====================================================
  get paginatedMedicines() {
    const start = (this.currentPage - 1) * this.pageSize;
    // return this.medicines.slice(start, start + this.pageSize);
    return (this.filteredMedicines ?? []).slice(start, start + this.pageSize);
  }

  get totalPages() {
    // return Math.ceil(this.medicines.length / this.pageSize);
    return Math.ceil((this.filteredMedicines ?? []).length / this.pageSize);
  }

  // =====================================================
  // LOAD ALL MEDICINES
  // =====================================================
  loadMedicines(): void {
    this.isLoading = true;

    this.medicineService.getAllMedicines().subscribe({
      next: (data: Medicine[]) => {
        this.medicines = data ?? [];
        this.filteredMedicines = data ?? [];

        // ❌ REMOVED infinite recursion
        // this.loadMedicines();

        // ❌ REMOVED unnecessary duplicate API call
        // this.refreshMedicines();

        this.currentPage = 1;

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading medicines:', err);
        this.medicines = [];
        this.filteredMedicines = [];
        this.isLoading = false;
      },
    });
  }

  // =====================================================
  // GET MEDICINE BY ID
  // =====================================================
  getMedicineById(id: number): void {
    this.medicineService.getMedicineById(id).subscribe({
      next: (data: Medicine) => {
        // 🔥 Force Angular to detect change
        this.selectedMedicine = data;

        // ✅ FORCE UI UPDATE
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching medicine by ID:', err);
      },
    });
  }

  editMedicine(med: Medicine): void {
    this.router
      .navigate(['/medicine'], { state: { medicine: med } })
      .then((success) => {
        if (!success) {
          console.warn('Navigation failed');
        }
      })
      .catch((err) => console.error('Navigation error:', err));
  }

  // =====================================================
  // UPDATE MEDICINE
  // =====================================================
  updateMedicine(): void {
    if (!this.selectedMedicine || !this.selectedMedicine.medicineId) return;

    this.medicineService
      .updateMedicine(this.selectedMedicine.medicineId, this.selectedMedicine)
      .subscribe({
        next: () => {
          this.loadMedicines();
          this.selectedMedicine = null;
        },
        error: (err) => {
          console.error('Medicine update error:', err);
        },
      });
  }

  // =====================================================
  // DELETE MEDICINE
  // =====================================================
  deleteMedicine(id: number): void {
    this.medicineService.deleteMedicine(id).subscribe({
      next: () => {
        // ✅ Only ONE reload call
        this.loadMedicines();
        // this.refreshMedicines();
      },
      error: (err) => {
        console.error('Delete error:', err);
      },
    });
  }

  // =====================================================
  // KEYDOWN -> BLOCK INVALID TYPING
  // =====================================================
  onlyPriceInputForSearch(event: KeyboardEvent): void {
    const allowedKeysForSearch = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

    // Allow control keys
    if (allowedKeysForSearch.includes(event.key)) return;

    // Allow numbers
    if (/^[0-9]$/.test(event.key)) return;

    // Allow only ONE dot
    if (event.key === '.') {
      const input = event.target as HTMLInputElement;
      if (input.value.includes('.')) {
        event.preventDefault();
      }
      return;
    }

    event.preventDefault();
  }

  // =====================================================
  // INPUT 2 DECIMAL NUMBERS
  // =====================================================
  validatePriceForSearch(event: any): void {
    let valueForSearch = event.target.value;

    // Keep only numbers and dot
    valueForSearch = valueForSearch.replace(/[^0-9.]/g, '');

    // Allow only first dot
    const parts = valueForSearch.split('.');
    if (parts.length > 2) {
      valueForSearch = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit to 2 decimal places
    if (valueForSearch.includes('.')) {
      const [integer, decimal] = valueForSearch.split('.');
      valueForSearch = integer + '.' + decimal.slice(0, 2);
    }

    event.target.value = valueForSearch;
    this.newMedicineForSearch.price = valueForSearch;
  }
}

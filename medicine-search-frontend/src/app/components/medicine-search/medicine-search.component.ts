import { Component, OnInit } from '@angular/core';
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

  constructor(
    private medicineService: MedicineService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const nav = history.state;

    this.refreshMedicines();

    if (nav && nav.medicine) {
      this.selectedMedicine = nav.medicine;
    }

    this.loadMedicines();
  }

  // =====================================================
  // SEARCH MEDICINES
  // =====================================================
  search(): void {
    const keyword = this.searchText.trim();

    if (!keyword) {
      this.filteredMedicines = [...this.medicines];
      return;
    }

    this.medicineService.searchMedicines(keyword).subscribe({
      next: (data: Medicine[]) => {
        this.filteredMedicines = data ?? [];
      },
      error: (err) => {
        console.error('Search error:', err);
        this.filteredMedicines = [];
      },
    });
  }

  // =====================================================
  // REFRESH MEDICINES
  // =====================================================
  refreshMedicines(): void {
    this.medicineService.refreshMedicines().subscribe({
      next: (data: Medicine[]) => {
        this.medicines = data ?? [];
        this.filteredMedicines = data ?? [];
      },
      error: (err) => {
        console.error('Refresh medicines error:', err);
      },
    });
  }

  // =====================================================
  // LOADING SPINNER
  // =====================================================
  get paginatedMedicines() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.medicines.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.medicines.length / this.pageSize);
  }

  // =====================================================
  // LOAD ALL MEDICINES
  // =====================================================
  loadMedicines(): void {
    this.isLoading = true;

    this.medicineService.getAllMedicines().subscribe({
      next: (data: Medicine[]) => {
        this.medicines = data ?? [];
        this.loadMedicines();
        this.refreshMedicines();
        this.filteredMedicines = data ?? [];
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
        this.selectedMedicine = data;
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
  // DELETE MEDICINE
  // =====================================================
  deleteMedicine(id: number): void {
    this.medicineService.deleteMedicine(id).subscribe({
      next: () => {
        this.loadMedicines();
        this.refreshMedicines();
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

  // =====================================================
  // UPDATE MEDICINE
  // =====================================================
  updateMedicine(): void {
    if (!this.selectedMedicine || !this.selectedMedicine.medicineId) return;

    this.medicineService.updateMedicine(this.selectedMedicine.medicineId, this.selectedMedicine).subscribe({
      next: () => {
        this.loadMedicines();
        this.selectedMedicine = null;
      },
      error: (err) => {
        console.error('Medicine update error:', err);
      },
    });
  }
}

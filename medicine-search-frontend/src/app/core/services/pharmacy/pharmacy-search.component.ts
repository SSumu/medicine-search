import { Component, OnInit } from '@angular/core';
import { PharmacySearchService, PharmacyResponseDTO } from './pharmacy-search.service';
// import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [/* CommonModule,*/ FormsModule],
  templateUrl: './pharmacy-search.component.html',
  styleUrls: ['pharmacy-search.component.scss'],
})
export class PharmacySearchComponent implements OnInit {
  pharmacies: PharmacyResponseDTO[] = [];
  filteredPharmacies: PharmacyResponseDTO[] = [];

  // ✅ Selected inventory (FIXED TYPE SAFE)
  selectedPharmacy: PharmacyResponseDTO | null = null;

  // Search fields
  searchLocation = '';
  searchPharmacy = '';

  formData: any = {
    pharmacyName: '',
    pharmacyLocation: '',
    medicineName: '',
    quantity: null,
  };

  editId!: number | null;

  isLoading = false;
  currentPage = 1;
  pageSize = 5;

  constructor(private pharmacyService: PharmacySearchService) {}

  ngOnInit(): void {
    // this.refreshInventories();

    // this.loadPharmacies();
  }

  // =====================================================
  // REFRESH INVENTORIES
  // =====================================================
  refreshPharmacies(): void {
    this.pharmacyService.refreshPharmacies().subscribe({
      next: (data: PharmacyResponseDTO[]) => {
        this.pharmacies = data ?? [];
        this.filteredPharmacies = data ?? [];
      },
      error: (err) => {
        console.error('Failed to refresh inventories:', err);
      },
    });
  }

  // =====================================================
  // PAGINATION | LOADING SPINNER
  // =====================================================
  get paginatedPharmacies() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.pharmacies.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.pharmacies.length / this.pageSize);
  }

  // =====================================================
  // LOAD ALL INVENTORIES (FIXED: no recursion | removed infinite loop)
  // =====================================================
  loadPharmacies(): void {
    this.isLoading = true;

    this.pharmacyService.getAllPharmacies().subscribe({
      next: (data: PharmacyResponseDTO[]) => {
        this.pharmacies = data ?? [];
        this.loadPharmacies();
        this.refreshPharmacies();
        this.filteredPharmacies = data ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading inventories:', err);
        this.pharmacies = [];
        this.filteredPharmacies = [];
        this.isLoading = false;
      },
    });
  }

  // Search by location
  searchLocationFn() {
    if (!this.searchLocation) return;

    this.pharmacyService
      .searchByLocation(this.searchLocation)
      .subscribe((data) => (this.pharmacies = data));
  }

  // Search By PharmacySearchComponent
  searchPharmacyFn() {
    if (!this.searchPharmacy) return;

    this.pharmacyService
      .searchByPharmacy(this.searchPharmacy)
      .subscribe((data) => (this.pharmacies = data));
  }

  // Available stock
  loadAvailable() {
    this.pharmacyService.getAvailable().subscribe((data) => (this.pharmacies = data));
  }

  // =====================================================
  // ✅ SELECTED INVENTORY
  // =====================================================
  selectPharmacy(nav: any) {
    this.selectedPharmacy = nav.pharmacy;
  }

  // =====================================================
  // EDIT MEDICINES
  // =====================================================
  editInventory(item: PharmacyResponseDTO) {
    this.editId = item.id;

    // Also set selectedInventory for editing. clone object for editing
    this.selectedPharmacy = { ...item };

    this.formData = {
      pharmacyName: item.pharmacy.pharmacyName,
      pharmacyLocation: item.pharmacy.pharmacyLocation,
      medicineName: item.medicine.medicineName,
      quantity: item.quantity ?? 0,
    };
  }

  // =====================================================
  // UPDATE MEDICINE
  // =====================================================
  updateInventory(): void {
    if (!this.selectedPharmacy || !this.selectedPharmacy.id) return;

    this.pharmacyService
      .updatePharmacy(this.selectedPharmacy.id, this.selectedPharmacy)
      .subscribe({
        next: () => {
          this.loadPharmacies();
          this.selectedPharmacy = null;
        },
        error: (err) => {
          console.error('Failed to update inventories:', err);
        },
      });
  }

  // =====================================================
  // DELETE MEDICINES
  // =====================================================
  deleteInventory(id: number): void {
    this.pharmacyService.deletePharmacy(id).subscribe({
      next: () => {
        this.loadPharmacies();
        this.refreshPharmacies();
      },
      error: (err) => {
        console.error('Failed to delete inventories:', err);
      },
    });
  }

  // resetForm() {
  //   this.editId = null;
  //   this.formData = {
  //     pharmacyName: '',
  //     pharmacyLocation: '',
  //     medicineName: '',
  //     quantity: 0,
  //   };
  // }
}

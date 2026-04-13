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

  /* ===============================
      SEARCH
  * ================================ */
  search(): void {
    const location = this.searchLocation.trim();
    const pharmacy = this.searchPharmacy.trim();

    // Case 1: nothing entered → load all
    if (!location && !pharmacy) {
      this.loadPharmacies();
      return;
    }

    // Case 2: only location
    if (location && !pharmacy) {
      this.pharmacyService.searchByLocation(location).subscribe({
        next: (data) => {
          this.pharmacies = data ?? [];
        },
        error: (err) => console.error('Location search failed: ', err),
      });
      return;
    }

    // Case 3: only pharmacy name
    if (!location && pharmacy) {
      this.pharmacyService.searchByPharmacy(pharmacy).subscribe({
        next: (data) => {
          this.pharmacies = data ?? [];
        },
        error: (err) => console.error('Pharmacy search failed: ', err),
      });
      return;
    }

    // Case 4: BOTH location + pharmacy
    this.pharmacyService.searchByLocation(location).subscribe({
      next: (data) => {
        // filter the location result by pharmacy name (frontend filtering)
        this.pharmacies = (data ?? [])
          .filter(item =>
          item.pharmacy?.pharmacyName?.toLowerCase()
            .includes(pharmacy.toLowerCase())
        );
      },
      error: (err) => console.error('Combined search failed: ', err),
    });
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

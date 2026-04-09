import { Component, OnInit } from '@angular/core';
import { InventoryService, InventoryResponseDTO } from './inventory.service';
// import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [/* CommonModule,*/ FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  inventories: InventoryResponseDTO[] = [];
  filteredInventories: InventoryResponseDTO[] = [];

  // ✅ Selected inventory (FIXED TYPE SAFE)
  selectedInventory: InventoryResponseDTO | null = null;

  // Search fields
  searchMedicine = '';
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

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    // this.refreshInventories();

    this.loadInventories();
  }

  // =====================================================
  // REFRESH INVENTORIES
  // =====================================================
  refreshInventories(): void {
    this.inventoryService.refreshInventories().subscribe({
      next: (data: InventoryResponseDTO[]) => {
        this.inventories = data ?? [];
        this.filteredInventories = data ?? [];
      },
      error: (err) => {
        console.error('Failed to refresh inventories:', err);
      },
    });
  }

  // =====================================================
  // PAGINATION | LOADING SPINNER
  // =====================================================
  get paginatedInventories() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.inventories.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.inventories.length / this.pageSize);
  }

  // =====================================================
  // LOAD ALL INVENTORIES (FIXED: no recursion | removed infinite loop)
  // =====================================================
  loadInventories(): void {
    this.isLoading = true;

    this.inventoryService.getAllInventories().subscribe({
      next: (data: InventoryResponseDTO[]) => {
        this.inventories = data ?? [];
        this.loadInventories();
        this.refreshInventories();
        this.filteredInventories = data ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading inventories:', err);
        this.inventories = [];
        this.filteredInventories = [];
        this.isLoading = false;
      },
    });
  }

  // =====================================================
  // SEARCH
  // =====================================================
  // Search by medicine
  searchMedicineFn() {
    if (!this.searchMedicine) return;

    this.inventoryService
      .searchByMedicine(this.searchMedicine)
      .subscribe((data) => (this.inventories = data));
  }

  // Search by location
  searchLocationFn() {
    if (!this.searchLocation) return;

    this.inventoryService
      .searchByLocation(this.searchLocation)
      .subscribe((data) => (this.inventories = data));
  }

  // Search By PharmacyComponent
  searchPharmacyFn() {
    if (!this.searchPharmacy) return;

    this.inventoryService
      .searchByPharmacy(this.searchPharmacy)
      .subscribe((data) => (this.inventories = [data]));
  }

  // Available stock
  loadAvailable() {
    this.inventoryService.getAvailable().subscribe((data) => (this.inventories = data));
  }

  // =====================================================
  // ✅ SELECTED INVENTORY
  // =====================================================
  selectInventory(nav: any) {
    this.selectedInventory = nav.inventory;
  }

  // =====================================================
  // EDIT MEDICINES
  // =====================================================
  editInventory(item: InventoryResponseDTO) {
    this.editId = item.id;

    // Also set selectedInventory for editing. clone object for editing
    this.selectedInventory = { ...item };

    this.formData = {
      pharmacyName: item.pharmacyName,
      pharmacyLocation: item.pharmacyLocation,
      medicineName: item.medicineName,
      quantity: item.quantity ?? 0,
    };
  }

  // =====================================================
  // UPDATE MEDICINE
  // =====================================================
  updateInventory(): void {
    if (!this.selectedInventory || !this.selectedInventory.id) return;

    this.inventoryService
      .updateInventory(this.selectedInventory.id, this.selectedInventory)
      .subscribe({
        next: () => {
          this.loadInventories();
          this.selectedInventory = null;
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
    this.inventoryService.deleteInventory(id).subscribe({
      next: () => {
        this.loadInventories();
        this.refreshInventories();
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

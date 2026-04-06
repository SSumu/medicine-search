import { Component, OnInit } from '@angular/core';
import { InventoryService, InventoryResponseDTO } from './inventory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PharmacyComponent} from '../../../components/pharmacy/pharmacy.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, PharmacyComponent],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  inventories: InventoryResponseDTO[] = [];

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

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  // Load all inventory
  loadAll() {
    this.inventoryService.getAll().subscribe((data) => {
      this.inventories = data;
    });
  }

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

  // Save (create or update)
  save() {
    if (this.editId) {
      this.inventoryService.update(this.editId, this.formData).subscribe(() => {
        this.loadAll();
        this.resetForm();
      });
    } else {
      this.inventoryService.create(this.formData).subscribe(() => {
        this.loadAll();
        this.resetForm();
      });
    }
  }

  // Edit
  edit(item: InventoryResponseDTO) {
    this.editId = item.id;
    this.formData = {
      pharmacyName: item.pharmacyName,
      pharmacyLocation: item.pharmacyLocation,
      medicineName: item.medicineName,
      quantity: item.quantity,
    };
  }

  // Delete
  delete(id: number) {
    this.inventoryService.delete(id).subscribe(() => this.loadAll());
  }

  resetForm() {
    this.editId = null;
    this.formData = {
      pharmacyName: '',
      pharmacyLocation: '',
      medicineName: '',
      quantity: 0,
    };
  }
}

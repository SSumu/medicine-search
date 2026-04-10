import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  InventoryRequestDTO,
  InventoryResponseDTO,
  InventoryService,
} from '../../core/services/inventory/inventory.service';
import {PopupComponent} from "../popup/popup.component";

@Component({
  selector: 'app-pharmacy',
  standalone: true,
  imports: [FormsModule, PopupComponent],
  templateUrl: './pharmacy.component.html',
  styleUrl: './pharmacy.component.scss',
})
export class PharmacyComponent implements OnInit {
  // ================================
  // DATA
  // ================================
  pharmacies: InventoryResponseDTO[] = [];

  newPharmacy: InventoryRequestDTO = {
    pharmacyName: '',
    pharmacyLocation: '',
  };

  // ================================
  // VALIDATION ERRORS
  // ================================
  errors = {
    pharmacyName: '',
    pharmacyLocation: '',
  };

  submitted = false;

  // ================================
  // ✅ POPUP STATE
  // ================================
  popupVisible: boolean = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';

  // ================================
  // CONSTRUCTOR
  // ================================
  constructor(private inventoryService: InventoryService) {}

  // ================================
  // INIT
  // ================================
  ngOnInit(): void {
    this.loadInventories();
  }

  // ================================
  // LOAD ALL MEDICINES
  // ================================
  loadInventories(): void {
    this.inventoryService.getAllInventories().subscribe({
      next: (data) => {
        this.pharmacies = data;
      },
      error: (err) => {
        console.error('Error loading pharmacies', err);
        this.showPopupMessage('Failed to load pharmacies', 'error');
      },
    });
  }

  // =====================================================
  // CREATE PHARMACY
  // =====================================================
  createPharmacy(): void {
    this.submitted = true;

    if (!this.validateForm()) {
      return;
    }

    this.inventoryService.createInventory(this.newPharmacy).subscribe({
      next: () => {
        this.showPopupMessage('Pharmacy added successfully!', 'success');
        this.loadInventories();
        this.clearForm();
      },
      error: () => {
        this.showPopupMessage('Failed to add pharmacy!', 'error');
      },
    });
  }

  // ================================
  // CLEAR FORM
  // ================================
  clearForm(): void {
    this.newPharmacy = {
      pharmacyName: '',
      pharmacyLocation: '',
    };

    this.submitted = false;
  }

  // ================================
  // VALIDATION
  // ================================
  validateForm(): boolean {
    // Reset errors
    this.errors = {
      pharmacyName: '',
      pharmacyLocation: '',
    };

    let isValid = true;

    const name = this.newPharmacy.pharmacyName?.trim() || '';
    const location = this.newPharmacy.pharmacyLocation?.trim() || '';

    if (!name) {
      this.errors.pharmacyName = 'Pharmacy name is required';
      isValid = false;
    }

    if (!location) {
      this.errors.pharmacyLocation = 'Pharmacy location is required';
      isValid = false;
    }

    return isValid;
  }

  // ================================
  // POPUP METHODS
  // ================================
  showPopupMessage(message: string, type: 'success' | 'error'): void {
    this.popupMessage = message;
    this.popupType = type;
    this.popupVisible = true;

    // Auto close after 3 seconds
    setTimeout(() => {
      this.closePopup();
    }, 3000);
  }

  closePopup(): void {
    this.popupVisible = false;
  }
}

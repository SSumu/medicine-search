import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PharmacyRequestDTO,
  PharmacyResponseDTO,
  PharmacySearchService,
} from '../../core/services/pharmacy/pharmacy-search.service';
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
  pharmacies: PharmacyResponseDTO[] = [];

  newPharmacy: PharmacyRequestDTO = {
    pharmacyName: '',
    pharmacyLocation: '',
    city: '',
    country: '',
    contactNumber: null,
    email: ''
  };

  // ================================
  // VALIDATION ERRORS
  // ================================
  errors = {
    pharmacyName: '',
    pharmacyLocation: '',
    city: '',
    country: '',
    contactNumber: '',
    email: ''
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
  constructor(private pharmacyService: PharmacySearchService) {}

  // ================================
  // INIT
  // ================================
  ngOnInit(): void {
    // this.loadPharmacies(); // loadPharmacies() must not be in here because it will load the page unnecessarily.
  }

  // ================================
  // LOAD ALL MEDICINES
  // ================================
  loadPharmacies(): void {
    this.pharmacyService.getAllPharmacies().subscribe({
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

    this.pharmacyService.createPharmacy(this.newPharmacy).subscribe({
      next: () => {
        this.showPopupMessage('Pharmacy added successfully!', 'success');
        this.loadPharmacies();
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
      city: '',
      country: '',
      contactNumber: null,
      email: ''
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
      city: '',
      country: '',
      contactNumber: '',
      email: ''
    };

    let isValid = true;

    const name = this.newPharmacy.pharmacyName?.trim() || '';
    const location = this.newPharmacy.pharmacyLocation?.trim() || '';
    const city = this.newPharmacy.city?.trim() || '';
    const country = this.newPharmacy.country?.trim() || '';
    const contactNumber = this.newPharmacy.contactNumber || null;
    const email = this.newPharmacy.email?.trim() || '';

    if (!name) {
      this.errors.pharmacyName = 'Pharmacy name is required';
      isValid = false;
    }

    if (!location) {
      this.errors.pharmacyLocation = 'Pharmacy location is required';
      isValid = false;
    }

    if (!city) {
      this.errors.city = 'City is required';
      isValid = false;
    }

    if (!country) {
      this.errors.country = 'Country is required';
      isValid = false;
    }

    if (!contactNumber) {
      this.errors.contactNumber = 'Contact Number is required';
      isValid = false;
    }

    if (!email) {
      this.errors.email = 'Email is required';
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

import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PharmacyRequestDTO,
  PharmacyResponseDTO,
  PharmacySearchService,
} from '../../core/services/pharmacy-search/pharmacy-search.service';
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
  //              DATA
  // ================================
  pharmacies: PharmacyResponseDTO[] = [];

  newPharmacy: PharmacyRequestDTO = {
    pharmacyName: '',
    pharmacyLocation: '',
    city: '',
    country: '',
    contactNumber: null,
    email: '',
    available: false,
  };

  // ================================
  //        VALIDATION ERRORS
  // ================================
  errors = {
    pharmacyName: '',
    pharmacyLocation: '',
    city: '',
    country: '',
    contactNumber: '',
    email: '',
    schedule: ''
  };

  submitted = false;

  // ================================
  //          ✅ POPUP STATE
  // ================================
  popupVisible: boolean = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';

  // ==================
  //  WEEKLY SCHEDULE
  // ==================
  weekDays = [
    { day: 'Monday', open: false, openTime: '', closeTime: '' },
    { day: 'Tuesday', open: false, openTime: '', closeTime: '' },
    { day: 'Wednesday', open: false, openTime: '', closeTime: '' },
    { day: 'Thursday', open: false, openTime: '', closeTime: '' },
    { day: 'Friday', open: false, openTime: '', closeTime: '' },
    { day: 'Saturday', open: false, openTime: '', closeTime: '' },
    { day: 'Sunday', open: false, openTime: '', closeTime: '' },
  ];

  // ================================
  //            CONSTRUCTOR
  // ================================
  constructor(
      private pharmacyService: PharmacySearchService,
      private cdr: ChangeDetectorRef
  ) {}

  // ================================
  // INIT
  // ================================
  ngOnInit(): void {
    // this.loadPharmacies(); // loadPharmacies() must not be in here because it will load the page unnecessarily.
  }

  // ================================
  //        LOAD ALL MEDICINES
  // ================================
  loadPharmacies(): void {
    this.pharmacyService.getAllPharmacies().subscribe({
      next: (data) => {
        this.pharmacies = data.content;
      },
      error: (err) => {
        console.error('Error loading pharmacies', err);
        this.showPopupMessage('Failed to load pharmacies', 'error');
      },
    });
  }

  // =====================================================
  //                  CREATE PHARMACY
  // =====================================================
  createPharmacy(): void {
    this.submitted = true;

    // optional early update
    this.cdr.detectChanges();

    const isFormValid = this.validateForm();
    const isScheduleValid = this.validateSchedule();

    // ➕ Schedule validation
    if (!isFormValid || !isScheduleValid) {
      return;
    }

    // ➕ attach schedule with newPharmacy
    const payload = {
      ...this.newPharmacy,
      contactNumber: this.newPharmacy.contactNumber || '', // ✅ prevent null
      available: true,
      schedule: this.weekDays,
    };

    this.pharmacyService.createPharmacy(payload).subscribe({
      next: () => {
        this.showPopupMessage('Pharmacy added successfully!', 'success');
        this.loadPharmacies();
        // this.clearForm();

        // ➕ reset after success
        this.resetForm();

        // ✅ optional safety fix
        this.cdr.detectChanges();
      },
      error: () => {
        this.showPopupMessage('Failed to add pharmacy!', 'error');
      },
    });
  }

  // ================================
  // CLEAR FORM
  // ================================
  // clearForm(): void {
  //   this.newPharmacy = {
  //     pharmacyName: '',
  //     pharmacyLocation: '',
  //     city: '',
  //     country: '',
  //     contactNumber: null,
  //     email: ''
  //   };
  //
  //   this.submitted = false;
  // }

  // ================================
  //            CLEAR FORM
  // ================================
  resetForm(): void {
    this.newPharmacy = {
      pharmacyName: '',
      pharmacyLocation: '',
      city: '',
      country: '',
      contactNumber: null,
      email: '',
      available: false,
    };

    this.submitted = false;

    this.errors = {
      pharmacyName: '',
      pharmacyLocation: '',
      city: '',
      country: '',
      contactNumber: '',
      email: '',
      schedule: ''
    }

    this.weekDays = this.weekDays.map(day => ({
      ...day,
      open: false,
      openTime: '',
      closeTime: ''
    }));
  }

  // ================================
  //            VALIDATION
  // ================================
  validateForm(): boolean {
    // Reset errors
    this.errors = {
      pharmacyName: '',
      pharmacyLocation: '',
      city: '',
      country: '',
      contactNumber: '',
      email: '',
      schedule: ''
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
      isValid = false;
    }
    // ➕ Email format validation
    else if (!this.validateEmail(email)) {
      this.errors.email = 'Invalid email format';
      isValid = false;
    }

    return isValid;
  }

  // ================================
  //      VALIDATION SCHEDULE
  // ================================
  validateSchedule(): boolean {
    const hasAtLeastOneDay = this.weekDays.some(day => day.open);

    if (!hasAtLeastOneDay) {
      this.errors.schedule = 'Opening Schedule is required';
      return false;
    }

    this.errors.schedule = '';

    for (let day of this.weekDays) {
      if (day.open) {
        if (!day.openTime || !day.closeTime) {
          this.showPopupMessage(`Please enter time for ${day.day}`, 'error');
          return false;
        }

        if (day.openTime >= day.closeTime) {
          this.showPopupMessage(`Invalid time range for ${day.day}`, 'error');
          return false;
        }
      }
    }
    return true;
  }

  // ================================
  //      VALIDATION EMAIL
  // ================================
  validateEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  onNumberInput(event: any) {
    const input = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = input;
    this.newPharmacy.contactNumber = input;
  }

  // ================================
  //          POPUP METHODS
  // ================================
  showPopupMessage(message: string, type: 'success' | 'error'): void {
    this.popupMessage = message;
    this.popupType = type;
    this.popupVisible = true;

    this.cdr.detectChanges();

    // Auto close after 3 seconds
    setTimeout(() => {
      this.closePopup();
    }, 3000);
  }

  closePopup(): void {
    this.popupVisible = false;
  }
}

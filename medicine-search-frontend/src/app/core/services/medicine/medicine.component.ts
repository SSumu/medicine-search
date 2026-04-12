import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { Medicine } from '../../../models/medicine/medicine.model';
import { MedicineService } from './medicine.service';
import { PopupComponent } from '../../../components/popup/popup.component';
import { MedicineRequestModel } from '../../../models/medicine-request.model/medicine-request.model';

@Component({
  selector: 'app-medicine',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupComponent],
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss'],
})
export class MedicineComponent implements OnInit {

  // ================================
  // PROPERTIES
  // ================================
  medicines: Medicine[] = [];
  selectedMedicine: Medicine | null = null;

  newMedicine: Medicine = {
    medicineId: 0,
    medicineName: '',
    manufacturer: '',
    quantity: null,
    price: null,
    description: '',
  };

  errors = {
    medicineName: '',
    manufacturer: '',
    quantity: '',
    price: '',
    description: ''
  }

  // ================================
  // PRICE HANDLING
  // ================================
  priceInput: string = ''; // ✅ UI binding
  isValidPrice: boolean = false;

  submitted: boolean = false;

  // ================================
  // ✅ POPUP STATE
  // ================================
  popupVisible: boolean = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';

  // ================================
  // CONSTRUCTOR
  // ================================
  constructor(private medicineService: MedicineService) {}

  // ================================
  // LIFECYCLE
  // ================================
  ngOnInit(): void {
    const nav = history.state;

    if (nav && nav.medicine) {
      this.selectedMedicine = nav.medicine;
    }

    console.log('MedicineComponent INIT');

    // ✅ ONLY ONE CALL — service handles caching
    this.loadMedicines();
  }

  // ================================
  // LOAD ALL MEDICINES
  // ================================
  loadMedicines(): void {
    this.medicineService.getAllMedicines().subscribe({
      next: (data) => {
        this.medicines = data;
      },
      error: (err) => {
        console.error('Error loading medicine:', err);
      },
    });
  }

  // =====================================================
  // ADD MEDICINE
  // =====================================================
  addMedicine(form: NgForm): void {
    this.submitted = true;
    this.validatePrice();

    if (!this.validateForm() || !this.isValidPrice) {
      return;
    }

    const payload: MedicineRequestModel = {
      medicineName: this.newMedicine.medicineName,
      manufacturer: this.newMedicine.manufacturer,
      quantity: this.newMedicine.quantity,
      price: parseFloat(this.priceInput),
      description: this.newMedicine.description
    };

    this.medicineService.addMedicine(payload).subscribe({
      next: (res: Medicine) => {
        console.log('Medicine was added', res);

        // ✅ Clear cache BEFORE reloading
        this.medicineService.clearCache();

        // ✅ Proper fix
        form.resetForm();

        // ✅ Clear immediately (better UX)
        this.clearForm();

        this.showPopupMessage('Medicine added successfully!', 'success');

        // Reload fresh data
        this.loadMedicines();

      },
      error: () => {
        this.showPopupMessage('Failed to add medicine!', 'error');
      },
    });
  }

  // ================================
  // POPUP METHODS
  // ================================
  showPopupMessage(message: string, type: 'success' | 'error'): void {
    this.popupMessage = message;
    this.popupType = type;
    this.popupVisible = true;

    // ✅ Auto close after 3 seconds
    setTimeout(() => {
      // this.popupVisible = true; // This causes for unexpected UI behavior.
      this.closePopup();
    }, 3000);
  }

  closePopup(): void {
    this.popupVisible = false;
  }

  // ================================
  // CLEAR FORM
  // ================================
  clearForm(): void {
    this.newMedicine = {
      medicineId: 0,
      medicineName: '',
      manufacturer: '',
      quantity: null,
      price: null,
      description: '',
    };

    this.priceInput = '';
    this.isValidPrice = false;
    this.submitted = false;
  }

  // ================================
  // VALIDATION
  // ================================
  validateForm(): boolean {

    // Reset errors
    this.errors = {
      medicineName: '',
      manufacturer: '',
      quantity: '',
      price: '',
      description: '',
    };

    let isValid = true;

    // ✅ Name validation
    if (!this.newMedicine.medicineName.trim()) {
      this.errors.medicineName = 'Medicine name is required';
      isValid = false;
    }

    // ✅ Manufacturer validation
    if (!this.newMedicine.manufacturer?.trim()) {
      this.errors.manufacturer = 'Manufacturer is required';
      isValid = false;
    }

    // ✅ Quantity validation (ONLY > 0, no null, no NaN)
    if (
      this.newMedicine.quantity === null ||
      this.newMedicine.quantity === undefined ||
      isNaN(Number(this.newMedicine.quantity)) ||
      Number(this.newMedicine.quantity) <= 0
    ) {
      this.errors.quantity = 'Quantity is required and it must be greater than 0';
      isValid = false;
    }

    // ✅ Price validation (ONLY > 0)
    if (
      !this.priceInput ||
      isNaN(Number(this.priceInput)) ||
      Number(this.priceInput) <= 0
    ) {
      this.errors.price = 'Price is required';
      isValid = false;
    }

    // ✅ Description validation
    if (!this.newMedicine.description?.trim()) {
      this.errors.description = 'Description is required';
      isValid = false;
    }

    return isValid;
  }

  // ===========================================================
  // KEYDOWN -> BLOCK INVALID TYPING (ALLOW ONLY NUMBERS + SINGLE DOT)
  // ===========================================================
  onlyPriceInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

    // Allow control keys
    if (allowedKeys.includes(event.key)) return;

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
  // FORMAT + VALIDATE PRICE (2 DECIMALS)
  // =====================================================
  formatPriceInput(event: any): void {
    let value = event.target.value;

    // Keep only numbers and dot
    value = value.replace(/[^0-9.]/g, '');

    // Allow only first dot
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit to 2 decimal places
    if (value.includes('.')) {
      const [integer, decimal] = value.split('.');
      value = integer + '.' + decimal.slice(0, 2);
    }

    this.priceInput = value;
    event.target.value = value;

    this.validatePrice();
  }

  // =====================================================
  // VALIDATE PRICE VALUE
  // =====================================================
  validatePrice(): void {
    const price = parseFloat(this.priceInput);
    this.isValidPrice = !isNaN(price) && price > 0;
  }

  // protected readonly NgForm = NgForm;
}

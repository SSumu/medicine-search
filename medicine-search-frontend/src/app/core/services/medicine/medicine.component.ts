import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Medicine } from '../../../models/medicine/medicine.model';
import { MedicineService } from './medicine.service';
import { PopupComponent } from '../../../components/popup/popup.component';

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
    id: 0,
    name: '',
    manufacturer: '',
    price: null,
    description: '',
  };

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
  addMedicine(): void {
    this.submitted = true;
    this.validatePrice();

    if (!this.validateForm() || !this.isValidPrice) {
      return;
    }

    // ✅ Convert string → number before sending
    this.newMedicine.price = parseFloat(this.priceInput.replace(/,/g, ''));

    this.medicineService.addMedicine(this.newMedicine).subscribe({
      next: () => {
        this.showPopupMessage('Medicine added successfully!', 'success');
        this.loadMedicines();
        this.clearForm();
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

    // Auto close after 3 seconds
    setTimeout(() => {
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
      id: 0,
      name: '',
      manufacturer: '',
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
    if (!this.newMedicine.name.trim()) {
      this.showPopupMessage('Medicine name is required', 'error');
      return false;
    }

    if (!this.newMedicine.manufacturer.trim()) {
      this.showPopupMessage('Manufacturer is required', 'error');
      return false;
    }

    if (!this.priceInput || isNaN(Number(this.priceInput))) {
      this.showPopupMessage('Price is required', 'error');
      return false;
    }

    if (!this.newMedicine.description?.trim()) {
      this.showPopupMessage('Description is required', 'error');
      return false;
    }

    return true;
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
}

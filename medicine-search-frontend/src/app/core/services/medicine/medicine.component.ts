import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Medicine } from '../../../models/medicine/medicine.model';
import { MedicineService } from './medicine.service';

@Component({
  selector: 'app-medicine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss'],
})
export class MedicineComponent implements OnInit {
  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  searchText: string = '';

  selectedMedicine: Medicine | null = null;

  newMedicine: Medicine = {
    id: 0,
    name: '',
    manufacturer: '',
    price: null,
    description: '',
  };

  constructor(private medicineService: MedicineService) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  // =====================================================
  // LOAD ALL MEDICINES
  // =====================================================
  loadMedicines(): void {
    this.medicineService.getAllMedicines().subscribe({
      next: (data: Medicine[]) => {
        this.medicines = data ?? [];
        this.filteredMedicines = data ?? [];
      },
      error: (err) => {
        console.error('Error loading medicines:', err);
        this.medicines = [];
        this.filteredMedicines = [];
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

  // =====================================================
  // ADD MEDICINE
  // =====================================================
  addMedicine(): void {
    this.medicineService.addMedicine(this.newMedicine).subscribe({
      next: () => {
        this.loadMedicines();

        // Reset form
        this.newMedicine = {
          id: 0,
          name: '',
          manufacturer: '',
          price: 0,
          description: '',
        };
      },
      error: (err) => {
        console.error('Add error:', err);
      },
    });
  }

  // =====================================================
  // UPDATE MEDICINE
  // =====================================================
  updateMedicine(): void {
    if (!this.selectedMedicine || !this.selectedMedicine.id) return;

    this.medicineService.updateMedicine(this.selectedMedicine.id, this.selectedMedicine).subscribe({
      next: () => {
        this.loadMedicines();
        this.selectedMedicine = null;
      },
      error: (err) => {
        console.error('Update error:', err);
      },
    });
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
  // DELETE MEDICINE
  // =====================================================
  deleteMedicine(id: number): void {
    this.medicineService.deleteMedicine(id).subscribe({
      next: () => {
        this.loadMedicines();
      },
      error: (err) => {
        console.error('Delete error:', err);
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
        console.error('Refresh error:', err);
      },
    });
  }

  // =====================================================
  // KEYDOWN -> BLOCK INVALID TYPING
  // =====================================================
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
  // INPUT 2 DECIMAL NUMBERS
  // =====================================================
  validatePrice(event: any): void {
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

    event.target.value = value;
    this.newMedicine.price = value;
  }
}

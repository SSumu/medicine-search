import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Medicine } from '../../models/medicine/medicine.model';
import { MedicineService } from '../../core/services/medicine/medicine.service';

@Component({
  selector: 'app-medicine-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './medicine-search.html',
  styleUrl: './medicine-search.scss',
})
export class MedicineSearch {
  searchText: string = '';
  medicines: Medicine[] = [];

  constructor(private medicineService: MedicineService) {}

  search(): void {
    if (!this.searchText.trim()) return;

    this.medicineService.searchMedicines(this.searchText).subscribe((data) => {
      this.medicines = data;
    });
  }
}

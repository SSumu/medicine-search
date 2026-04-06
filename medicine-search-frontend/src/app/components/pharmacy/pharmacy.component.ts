import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Form structure used by the Pharmacy Component
 */
export interface InventoryForm {
  pharmacyName: string;
  pharmacyLocation: string;
  medicineName: string;
  quantity: number | null;
}

@Component({
  selector: 'app-pharmacy',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pharmacy.component.html',
  styleUrl: './pharmacy.component.scss',
})
export class PharmacyComponent {

  // =========================
  // INPUTS FROM PARENT
  // =========================
  @Input() formData: InventoryForm = {
    pharmacyName: '',
    pharmacyLocation: '',
    medicineName: '',
    quantity: null,
  };

  @Input() editId: number | null = null;

  // =========================
  // OUTPUT EVENTS TO PARENT
  // =========================
  @Output() saveEvent = new EventEmitter<void>();
  @Output() resetEvent = new EventEmitter<void>();

  // =========================
  // ACTION: SAVE / UPDATE
  // =========================
  save(): void {
    this.saveEvent.emit();
  }

  // =========================
  // ACTION: CLEAR FORM
  // =========================
  resetForm(): void {
    this.resetEvent.emit();
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Medicine } from '../../models/medicine/medicine.model';
import { ActivatedRoute } from '@angular/router';
import { MedicineService } from '../../core/services/medicine/medicine.service';

@Component({
  selector: 'app-medicine-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicine-details.html',
  styleUrl: './medicine-details.scss',
})
export class MedicineDetails {

  medicine?: Medicine;

  constructor(
    private route: ActivatedRoute,
    private medicineService: MedicineService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.medicineService.getMedicineById(id).subscribe((data) => {
        this.medicine = data;
      });
    }
  }
}

import { Routes } from '@angular/router';
import { DetailsPage, HomePage } from './app';
import { MedicineComponent } from './core/services/medicine/medicine.component';
import { MedicineSearchComponent } from './components/medicine-search/medicine-search.component';
import { PharmacyComponent } from './components/pharmacy/pharmacy.component';
import { PharmacySearchComponent } from './core/services/pharmacy-search/pharmacy-search.component';

export const routes: Routes = [
  { path: 'home', component: HomePage },
  { path: 'medicine-search', component: MedicineSearchComponent },
  { path: 'details', component: DetailsPage },
  { path: 'medicine', component: MedicineComponent },
  { path: 'pharmacy-search', component: PharmacySearchComponent },
  { path: 'pharmacy', component: PharmacyComponent},

  // Optional: redirect unknown routes
  { path: '**', redirectTo: '' }
];

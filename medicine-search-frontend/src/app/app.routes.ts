import { Routes } from '@angular/router';
import { DetailsPage, HomePage, SearchComponent } from './app';
import { MedicineComponent } from './core/services/medicine/medicine.component';
import { InventoryComponent } from './core/services/inventory/inventory.component';

export const routes: Routes = [
  { path: 'home', component: HomePage },
  { path: 'search', component: SearchComponent },
  { path: 'details', component: DetailsPage },
  { path: 'medicine', component: MedicineComponent },
  { path: 'inventory', component: InventoryComponent },

  // Optional: redirect unknown routes
  { path: '**', redirectTo: '' }
];

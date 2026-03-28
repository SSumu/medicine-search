import { Routes } from '@angular/router';
import { DetailsPage, HomePage, SearchComponent } from './app';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'search', component: SearchComponent },
  { path: 'details/:id', component: DetailsPage },

  // Optional: redirect unknown routes
  { path: '**', redirectTo: '' }
];

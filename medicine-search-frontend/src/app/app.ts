import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// -------------------- Header Component --------------------
@Component({
  selector: 'app-header',
  template: `
    <header>
      <h1>{{ title }}</h1>
      <nav>
        <a routerLink="/">Home</a> |
        <a routerLink="/search">Search</a> |
        <a routerLink="/details">Details</a>
      </nav>
    </header>
  `,
  styles: [
    `
      header {
        background-color: #4caf50;
        color: white;
        padding: 1rem;
      }
      nav a {
        margin: 0 0.5rem;
        color: white;
        text-decoration: none;
      }
    `,
  ],
  standalone: true,
  imports: [RouterModule],
})
export class Header {
  title = 'Medicine Search Service';
}

// -------------------- Footer Component --------------------
@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <p>&copy; 2026 Medicine Search. All rights reserved.</p>
    </footer>
  `,
  styles: [
    `
      footer {
        background-color: #eee;
        padding: 1rem;
        text-align: center;
      }
    `,
  ],
  standalone: true,
})
export class Footer {}

// -------------------- Home Page Component --------------------
@Component({
  selector: 'app-home',
  template: `
    <section>
      <h2>Welcome to Medicine Search</h2>
      <p>Use the search page to find medicines.</p>
    </section>
  `,
  styles: [
    `
      section {
        padding: 2rem;
        text-align: center;
      }
    `,
  ],
  standalone: true,
})
export class HomePage {}

// -------------------- Search Page Component --------------------
@Component({
  selector: 'app-search',
  template: `
    <section>
      <h2>Search Medicine</h2>
      <input type="text" [(ngModel)]="searchQuery" placeholder="Enter medicine name" />
      <button (click)="search()">Search</button>

      <!-- Only show the list if there are results -->
      @if (results.length > 0) {
        <ul>
          @for (med of results; track med.id) {
            <li>{{ med.name }} - {{ med.manufacturer }} - Rs.{{ med.price }}</li>
          }
        </ul>
      }

      <!-- Show a message if no results are found -->
      @if (results.length === 0 && searchQuery) {
        <p>No medicines found for "{{ searchQuery }}"</p>
      }
    </section>
  `,
  styles: [
    `
      section {
        padding: 2rem;
      }
      input {
        padding: 0.5rem;
        margin-right: 0.5rem;
      }
      button {
        padding: 0.5rem 1rem;
      }
    `,
  ],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class SearchComponent {
  searchQuery: string = '';
  results: { id: number; name: string; manufacturer: string; price: number }[] = [];

  search() {
    // Example search logic (replace with your API call)
    const allMeds = [
      { id: 1, name: 'Paracetamol', manufacturer: 'ABC Pharma', price: 50 },
      { id: 2, name: 'Ibuprofen', manufacturer: 'XYZ Pharma', price: 80 },
    ];
    this.results = allMeds.filter((med) =>
      med.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
    );
  }

  // TrackBy function for better performance
  // trackById(_index: number, item: any): number {
  //   return item.id;
  // }
}

// -------------------- Details Page Component --------------------
@Component({
  selector: 'app-details',
  template: `
    <section>
      <h2>Medicine Details</h2>
      <p>Select a medicine from search to see details here.</p>
    </section>
  `,
  styles: [
    `
      section {
        padding: 2rem;
      }
    `,
  ],
  standalone: true,
})
export class DetailsPage {}

// -------------------- Root App Component --------------------
@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [RouterModule, Header, Footer],
})
export class App {}

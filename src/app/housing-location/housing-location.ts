import { Component, input } from '@angular/core';
import { HousingLocationInfo } from '../housing-location';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-housing-location',
  imports: [CommonModule, RouterModule],
  template: `
  <section class="listing">
    <img 
      class="listing-photo"
      [src]="housingLocation().photo"
      alt="Exterior photo of {{ housingLocation().name }}"
      crossorigin
    />
    <h2 class="listing-heading">{{ housingLocation().name }}</h2>
    <p class="listing-location">{{ housingLocation().city }}, {{ housingLocation().state }}</p>
    <!-- <a class="primary" routerLink="details">Learn More</a> -->
    <a class="primary" [routerLink]="['/details', housingLocation().id]">Learn More</a>
  </section>
  `,
  // templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
}

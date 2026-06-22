import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HousingLocationInfo } from '../housing-location';
import { Housing } from '../housing';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  template: `
   <article>
    <img 
      class="listing-photo" 
      [src]="housingLocation?.photo" 
      alt="Exterior photo of {{ housingLocation?.name }}" 
      crossorigin
    />
    <section class="listing-description">
      <h2 class="listing-heading">{{ housingLocation?.name }}</h2>
      <p class="listing-location">{{ housingLocation?.city }}, {{ housingLocation?.state }}</p>
    </section>
    <section class="listing-features">
      <h2 class="section-heading">About this housing location</h2>
      <ul>
        <li>Units available: {{ housingLocation?.availableUnits }}</li>
        <li>Does this location have wifi? {{ housingLocation?.wifi ? 'Yes' : 'No' }}</li>
        <li>Does this location have laundry? {{ housingLocation?.laundry ? 'Yes' : 'No' }}</li>
      </ul>
    </section> 
  </article>
  `,
  styleUrls: ['./details.css'],
})
export class Details {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(Housing);
  housingLocation: HousingLocationInfo | undefined;

  constructor() {
    const housingLocationId = Number(this.route.snapshot.paramMap.get('id'));
    this.housingLocation = this.housingService.getHousingLocationById(housingLocationId);
  }
}

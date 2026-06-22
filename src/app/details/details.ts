import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HousingLocationInfo } from '../housing-location';
import { Housing } from '../housing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [CommonModule, ReactiveFormsModule],
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
    <section class="listing-apply">
      <h2 class="section-heading">Apply now to live here</h2>
      <form [formGroup]="applyForm" (submit)="submitApplication()">
        <label for="firstName">First Name</label>
        <input id="firstName" type="text" formControlName="firstName" />

        <label for="lastName">Last Name</label>
        <input id="lastName" type="text" formControlName="lastName" />

        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" />
         
        <button class="primary" type="submit">Apply Now</button>
      </form>
    </section> 
  </article>
  `,
  styleUrls: ['./details.css'],
})
export class Details {
  private changeDetectorRef = inject(ChangeDetectorRef);
  
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(Housing);
  housingLocation: HousingLocationInfo | undefined;

  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor() {
    // const housingLocationId = Number(this.route.snapshot.paramMap.get('id'));
    // this.housingLocation = this.housingService.getHousingLocationById(housingLocationId);

    const housingLocationId = parseInt(this.route.snapshot.paramMap.get('id') ?? '', 10);
    this.housingService
      .getHousingLocationById(housingLocationId)
      .then((housingLocation: HousingLocationInfo | undefined) => {
        this.housingLocation = housingLocation;
        this.changeDetectorRef.markForCheck(); // Notify Angular that a change happened that requires a synchronization.
      });
  }

  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? '',
    );
  }
}

import { Component, inject, signal } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../housing-location';
import { Housing } from '../housing';

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  template: `
   <section>
    <form>
      <input type="text" placeholder="Filter by city" #filter />
      <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
    </form>
  </section>
  <section class="results">
    @for (housingLocation of filteredLocationList(); track $index) {
      <app-housing-location [housingLocation]="housingLocation" />
    }
  </section> 
   `,
  styleUrl: './home.css',
})
export class Home {
  housingLocationList = signal<HousingLocationInfo[]>([]);
  filteredLocationList = signal<HousingLocationInfo[]>([]);
  housingService: Housing = inject(Housing);

  constructor() {
    // this.housingLocationList = this.housingService.getAllHousingLocations();
    // this.filteredLocationList = this.housingLocationList;

    this.housingService
      .getAllHousingLocations()
      .then((housingLocationList: HousingLocationInfo[]) => {
        this.housingLocationList.set(housingLocationList);
        this.filteredLocationList.set(housingLocationList);
      });
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList.set(this.housingLocationList());
      return;
    }

    const filtered = this.housingLocationList().filter((housingLocation: HousingLocationInfo) => {
      return housingLocation?.city.toLowerCase().includes(text.toLowerCase());
    });
    this.filteredLocationList.set(filtered);
  }

  /*
  housingLocation: HousingLocationInfo = {
    id: 9999,
    name: 'Test Home',
    city: 'Test city',
    state: 'ST',
    photo: `${this.baseUrl}/example-house.jpg`,
    availableUnits: 99,
    wifi: true,
    laundry: false,
  };
  */

}

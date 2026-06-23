import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { Home } from './home';
import { Housing } from '../housing';
import { HousingLocationInfo } from '../housing-location';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let housingService: Pick<Housing, 'getAllHousingLocations'>;

  const housingLocations: HousingLocationInfo[] = [
    {
      id: 1,
      name: 'A113 Transitional Housing',
      city: 'Santa Monica',
      state: 'CA',
      photo: 'a113.jpg',
      availableUnits: 0,
      wifi: false,
      laundry: true,
    },
    {
      id: 2,
      name: 'Warm Beds Housing Support',
      city: 'Chicago',
      state: 'IL',
      photo: 'warm-beds.jpg',
      availableUnits: 1,
      wifi: true,
      laundry: false,
    },
  ];

  beforeEach(async () => {
    housingService = {
      getAllHousingLocations: vi.fn().mockResolvedValue(housingLocations),
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        { provide: Housing, useValue: housingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load locations from the housing service', () => {
    expect(housingService.getAllHousingLocations).toHaveBeenCalled();
    expect(component.housingLocationList).toEqual(housingLocations);
    expect(component.filteredLocationList).toEqual(housingLocations);
  });

  it('should filter locations by city case-insensitively', () => {
    component.filterResults('chicago');

    expect(component.filteredLocationList).toEqual([housingLocations[1]]);
  });

  it('should reset to the full list when the filter text is empty', () => {
    component.filterResults('chicago');
    component.filterResults('');

    expect(component.filteredLocationList).toEqual(housingLocations);
  });
});

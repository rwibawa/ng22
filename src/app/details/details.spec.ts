import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { vi } from 'vitest';

import { Details } from './details';
import { Housing } from '../housing';
import { HousingLocationInfo } from '../housing-location';

describe('Details', () => {
  let component: Details;
  let fixture: ComponentFixture<Details>;
  let housingService: Pick<Housing, 'getHousingLocationById' | 'submitApplication'>;

  const housingLocation: HousingLocationInfo = {
    id: 1,
    name: 'A113 Transitional Housing',
    city: 'Santa Monica',
    state: 'CA',
    photo: 'details-photo.jpg',
    availableUnits: 0,
    wifi: false,
    laundry: true,
  };

  beforeEach(async () => {
    housingService = {
      getHousingLocationById: vi.fn().mockResolvedValue(housingLocation),
      submitApplication: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Details],
      providers: [
        { provide: Housing, useValue: housingService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Details);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the housing location from the route id', () => {
    expect(housingService.getHousingLocationById).toHaveBeenCalledWith(1);
    expect(component.housingLocation()).toEqual(housingLocation);
  });

  it('should submit the application form values', () => {
    component.applyForm.setValue({
      firstName: 'Ryan',
      lastName: 'Ibawa',
      email: 'ryan@example.com',
    });

    component.submitApplication();

    expect(housingService.submitApplication).toHaveBeenCalledWith(
      'Ryan',
      'Ibawa',
      'ryan@example.com',
    );
  });
});

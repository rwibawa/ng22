import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HousingLocation } from './housing-location';
import { HousingLocationInfo } from '../housing-location';

describe('HousingLocation', () => {
  let component: HousingLocation;
  let fixture: ComponentFixture<HousingLocation>;

  const housingLocation: HousingLocationInfo = {
    id: 1,
    name: 'A113 Transitional Housing',
    city: 'Santa Monica',
    state: 'CA',
    photo: 'location-photo.jpg',
    availableUnits: 0,
    wifi: false,
    laundry: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingLocation],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HousingLocation);
    fixture.componentRef.setInput('housingLocation', housingLocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the housing location content', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('A113 Transitional Housing');
    expect(compiled.textContent).toContain('Santa Monica, CA');
    expect(compiled.querySelector('img')?.getAttribute('src')).toBe('location-photo.jpg');
    expect(compiled.querySelector('a')?.getAttribute('href')).toBe('/details/1');
  });
});

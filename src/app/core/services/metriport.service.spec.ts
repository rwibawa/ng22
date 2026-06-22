import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MetriportService } from './metriport.service';
import { FhirBundle, FhirPatient, FhirEncounter } from '../models/fhir.models';
import { environment } from '../../../environments/environment';

describe('MetriportService', () => {
  let service: MetriportService;
  let httpMock: HttpTestingController;
  const base = environment.metriport.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetriportService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MetriportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('searchPatients should call GET /Patient', () => {
    const mockBundle: FhirBundle<FhirPatient> = {
      resourceType: 'Bundle',
      type: 'searchset',
      total: 1,
      entry: [
        {
          resource: {
            resourceType: 'Patient',
            id: 'p1',
            name: [{ family: 'Smith', given: ['John'] }],
            gender: 'male',
            birthDate: '1990-01-15',
          },
        },
      ],
    };

    service.searchPatients({ name: 'Smith', _count: 10 }).subscribe((bundle) => {
      expect(bundle.total).toBe(1);
      expect(bundle.entry?.length).toBe(1);
    });

    const req = httpMock.expectOne((r) => r.url === `${base}/Patient`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('name')).toBe('Smith');
    expect(req.request.params.get('_count')).toBe('10');
    expect(req.request.headers.has('x-api-key')).toBe(true);
    req.flush(mockBundle);
  });

  it('getPatient should call GET /Patient/:id', () => {
    const mockPatient: FhirPatient = {
      resourceType: 'Patient',
      id: 'abc123',
      name: [{ family: 'Doe', given: ['Jane'] }],
      gender: 'female',
    };

    service.getPatient('abc123').subscribe((p) => {
      expect(p.id).toBe('abc123');
    });

    const req = httpMock.expectOne(`${base}/Patient/abc123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPatient);
  });

  it('getPatientEncounters should call GET /Encounter with patient param', () => {
    const mockBundle: FhirBundle<FhirEncounter> = {
      resourceType: 'Bundle',
      type: 'searchset',
      entry: [],
    };

    service.getPatientEncounters('p1').subscribe();

    const req = httpMock.expectOne((r) => r.url === `${base}/Encounter`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('patient')).toBe('p1');
    req.flush(mockBundle);
  });

  it('getPatientConditions should call GET /Condition with patient param', () => {
    service.getPatientConditions('p2').subscribe();
    const req = httpMock.expectOne((r) => r.url === `${base}/Condition`);
    expect(req.request.params.get('patient')).toBe('p2');
    req.flush({ resourceType: 'Bundle', type: 'searchset', entry: [] });
  });

  it('getPatientMedications should call GET /MedicationRequest', () => {
    service.getPatientMedications('p3').subscribe();
    const req = httpMock.expectOne((r) => r.url === `${base}/MedicationRequest`);
    expect(req.request.params.get('patient')).toBe('p3');
    req.flush({ resourceType: 'Bundle', type: 'searchset', entry: [] });
  });

  it('getPatientObservations should call GET /Observation', () => {
    service.getPatientObservations('p4', 'vital-signs').subscribe();
    const req = httpMock.expectOne((r) => r.url === `${base}/Observation`);
    expect(req.request.params.get('patient')).toBe('p4');
    expect(req.request.params.get('category')).toBe('vital-signs');
    req.flush({ resourceType: 'Bundle', type: 'searchset', entry: [] });
  });

  it('getPatientDocuments should call GET /DocumentReference', () => {
    service.getPatientDocuments('p5').subscribe();
    const req = httpMock.expectOne((r) => r.url === `${base}/DocumentReference`);
    expect(req.request.params.get('patient')).toBe('p5');
    req.flush({ resourceType: 'Bundle', type: 'searchset', entry: [] });
  });

  it('getPatientEverything should call GET /Patient/:id/$everything', () => {
    service.getPatientEverything('p6').subscribe();
    const req = httpMock.expectOne(`${base}/Patient/p6/$everything`);
    expect(req.request.method).toBe('GET');
    req.flush({ resourceType: 'Bundle', type: 'collection', entry: [] });
  });
});

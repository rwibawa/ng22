import { TestBed } from '@angular/core/testing';
import { FhirHelperService } from './fhir-helper.service';
import {
  FhirPatient,
  FhirObservation,
  FhirCondition,
  FhirMedicationRequest,
  FhirDocumentReference,
  FhirEncounter,
} from '../models/fhir.models';

describe('FhirHelperService', () => {
  let service: FhirHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FhirHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- formatPatientName ---
  it('formatPatientName should return "Unknown" for empty input', () => {
    expect(service.formatPatientName()).toBe('Unknown');
    expect(service.formatPatientName([])).toBe('Unknown');
  });

  it('formatPatientName should return text when provided', () => {
    expect(service.formatPatientName([{ text: 'John Smith' }])).toBe('John Smith');
  });

  it('formatPatientName should concatenate given and family', () => {
    expect(
      service.formatPatientName([{ given: ['Jane', 'Mary'], family: 'Doe' }]),
    ).toBe('Jane Mary Doe');
  });

  it('formatPatientName should prefer official name', () => {
    const names = [
      { use: 'nickname', given: ['Jay'] },
      { use: 'official', given: ['Jane'], family: 'Doe' },
    ];
    expect(service.formatPatientName(names)).toBe('Jane Doe');
  });

  // --- formatAddress ---
  it('formatAddress should return empty string when no addresses', () => {
    expect(service.formatAddress()).toBe('');
    expect(service.formatAddress([])).toBe('');
  });

  it('formatAddress should return text when provided', () => {
    expect(service.formatAddress([{ text: '123 Main St, Boston, MA' }])).toBe(
      '123 Main St, Boston, MA',
    );
  });

  it('formatAddress should build address from parts', () => {
    const result = service.formatAddress([
      { line: ['123 Main St'], city: 'Boston', state: 'MA', postalCode: '02101' },
    ]);
    expect(result).toBe('123 Main St, Boston, MA, 02101');
  });

  // --- formatCodeableConcept ---
  it('formatCodeableConcept should return empty string for undefined', () => {
    expect(service.formatCodeableConcept()).toBe('');
  });

  it('formatCodeableConcept should return text field', () => {
    expect(service.formatCodeableConcept({ text: 'Hypertension' })).toBe('Hypertension');
  });

  it('formatCodeableConcept should return coding display', () => {
    expect(
      service.formatCodeableConcept({ coding: [{ display: 'Type 2 Diabetes', code: 'E11' }] }),
    ).toBe('Type 2 Diabetes');
  });

  it('formatCodeableConcept should fallback to coding code', () => {
    expect(service.formatCodeableConcept({ coding: [{ code: 'E11' }] })).toBe('E11');
  });

  // --- toPatientDisplay ---
  it('toPatientDisplay should map a FhirPatient to PatientDisplay', () => {
    const patient: FhirPatient = {
      resourceType: 'Patient',
      id: 'p1',
      name: [{ family: 'Smith', given: ['John'] }],
      gender: 'male',
      birthDate: '1990-05-10',
      telecom: [
        { system: 'phone', value: '555-1234' },
        { system: 'email', value: 'john@example.com' },
      ],
      address: [{ line: ['10 Elm St'], city: 'Springfield', state: 'IL' }],
    };
    const display = service.toPatientDisplay(patient);
    expect(display.id).toBe('p1');
    expect(display.fullName).toBe('John Smith');
    expect(display.gender).toBe('male');
    expect(display.phone).toBe('555-1234');
    expect(display.email).toBe('john@example.com');
    expect(display.address).toContain('Springfield');
  });

  // --- formatObservationValue ---
  it('formatObservationValue should format quantity', () => {
    const obs: FhirObservation = {
      resourceType: 'Observation',
      status: 'final',
      code: { text: 'Weight' },
      valueQuantity: { value: 75, unit: 'kg' },
    };
    expect(service.formatObservationValue(obs)).toBe('75 kg');
  });

  it('formatObservationValue should format string value', () => {
    const obs: FhirObservation = {
      resourceType: 'Observation',
      status: 'final',
      code: { text: 'Note' },
      valueString: 'Normal',
    };
    expect(service.formatObservationValue(obs)).toBe('Normal');
  });

  it('formatObservationValue should return empty for no value', () => {
    const obs: FhirObservation = {
      resourceType: 'Observation',
      status: 'final',
      code: { text: 'Test' },
    };
    expect(service.formatObservationValue(obs)).toBe('');
  });

  // --- formatMedicationName ---
  it('formatMedicationName should return medication concept text', () => {
    const med: FhirMedicationRequest = {
      resourceType: 'MedicationRequest',
      status: 'active',
      intent: 'order',
      subject: { reference: 'Patient/p1' },
      medicationCodeableConcept: { text: 'Metformin 500mg' },
    };
    expect(service.formatMedicationName(med)).toBe('Metformin 500mg');
  });

  it('formatMedicationName should fallback to reference display', () => {
    const med: FhirMedicationRequest = {
      resourceType: 'MedicationRequest',
      status: 'active',
      intent: 'order',
      subject: { reference: 'Patient/p1' },
      medicationReference: { display: 'Lisinopril' },
    };
    expect(service.formatMedicationName(med)).toBe('Lisinopril');
  });

  // --- formatDate ---
  it('formatDate should return empty string for undefined', () => {
    expect(service.formatDate()).toBe('');
  });

  it('formatDate should format a valid date', () => {
    const result = service.formatDate('2024-01-15');
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });

  // --- calculateAge ---
  it('calculateAge should return empty for undefined', () => {
    expect(service.calculateAge()).toBe('');
  });

  it('calculateAge should return age string', () => {
    const birthDate = '1990-01-01';
    const age = service.calculateAge(birthDate);
    expect(age).toMatch(/\d+ yrs/);
    const years = parseInt(age);
    expect(years).toBeGreaterThan(30);
  });

  // --- getDocumentUrl ---
  it('getDocumentUrl should return attachment URL', () => {
    const doc: FhirDocumentReference = {
      resourceType: 'DocumentReference',
      status: 'current',
      content: [{ attachment: { url: 'https://example.com/doc.pdf' } }],
    };
    expect(service.getDocumentUrl(doc)).toBe('https://example.com/doc.pdf');
  });

  it('getDocumentUrl should return undefined for empty content', () => {
    const doc: FhirDocumentReference = {
      resourceType: 'DocumentReference',
      status: 'current',
      content: [],
    };
    expect(service.getDocumentUrl(doc)).toBeUndefined();
  });

  // --- formatEncounterClass ---
  it('formatEncounterClass should return class display', () => {
    const enc: FhirEncounter = {
      resourceType: 'Encounter',
      status: 'finished',
      class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'AMB', display: 'ambulatory' },
    };
    expect(service.formatEncounterClass(enc)).toBe('ambulatory');
  });
});

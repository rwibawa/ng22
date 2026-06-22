// FHIR R4 Core Types

export interface FhirCoding {
  system?: string;
  code?: string;
  display?: string;
}

export interface FhirCodeableConcept {
  coding?: FhirCoding[];
  text?: string;
}

export interface FhirIdentifier {
  system?: string;
  value?: string;
  use?: string;
}

export interface FhirHumanName {
  use?: string;
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
}

export interface FhirAddress {
  use?: string;
  type?: string;
  text?: string;
  line?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface FhirContactPoint {
  system?: string;
  value?: string;
  use?: string;
}

export interface FhirPeriod {
  start?: string;
  end?: string;
}

export interface FhirReference {
  reference?: string;
  type?: string;
  display?: string;
}

export interface FhirQuantity {
  value?: number;
  unit?: string;
  system?: string;
  code?: string;
}

export interface FhirRange {
  low?: FhirQuantity;
  high?: FhirQuantity;
}

export interface FhirAnnotation {
  authorReference?: FhirReference;
  authorString?: string;
  time?: string;
  text: string;
}

export interface FhirAttachment {
  contentType?: string;
  language?: string;
  data?: string;
  url?: string;
  size?: number;
  title?: string;
  creation?: string;
}

export interface FhirMeta {
  versionId?: string;
  lastUpdated?: string;
  source?: string;
  profile?: string[];
}

export interface FhirBundleEntry<T> {
  fullUrl?: string;
  resource?: T;
}

export interface FhirBundle<T> {
  resourceType: 'Bundle';
  id?: string;
  meta?: FhirMeta;
  type: string;
  total?: number;
  entry?: FhirBundleEntry<T>[];
  link?: Array<{ relation: string; url: string }>;
}

// FHIR Patient Resource
export interface FhirPatient {
  resourceType: 'Patient';
  id?: string;
  meta?: FhirMeta;
  identifier?: FhirIdentifier[];
  active?: boolean;
  name?: FhirHumanName[];
  telecom?: FhirContactPoint[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  deceasedBoolean?: boolean;
  deceasedDateTime?: string;
  address?: FhirAddress[];
  maritalStatus?: FhirCodeableConcept;
  generalPractitioner?: FhirReference[];
  managingOrganization?: FhirReference;
}

// FHIR Encounter Resource
export interface FhirEncounterParticipant {
  type?: FhirCodeableConcept[];
  individual?: FhirReference;
}

export interface FhirEncounterLocation {
  location: FhirReference;
  status?: string;
}

export interface FhirEncounterHospitalization {
  admitSource?: FhirCodeableConcept;
  dischargeDisposition?: FhirCodeableConcept;
}

export interface FhirEncounter {
  resourceType: 'Encounter';
  id?: string;
  meta?: FhirMeta;
  identifier?: FhirIdentifier[];
  status: string;
  class?: FhirCoding;
  type?: FhirCodeableConcept[];
  subject?: FhirReference;
  participant?: FhirEncounterParticipant[];
  period?: FhirPeriod;
  reasonCode?: FhirCodeableConcept[];
  diagnosis?: Array<{ condition: FhirReference; use?: FhirCodeableConcept }>;
  location?: FhirEncounterLocation[];
  hospitalization?: FhirEncounterHospitalization;
  serviceProvider?: FhirReference;
}

// FHIR Observation Resource
export interface FhirObservationComponent {
  code: FhirCodeableConcept;
  valueQuantity?: FhirQuantity;
  valueCodeableConcept?: FhirCodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  referenceRange?: Array<{ low?: FhirQuantity; high?: FhirQuantity; text?: string }>;
}

export interface FhirObservation {
  resourceType: 'Observation';
  id?: string;
  meta?: FhirMeta;
  identifier?: FhirIdentifier[];
  status: string;
  category?: FhirCodeableConcept[];
  code: FhirCodeableConcept;
  subject?: FhirReference;
  encounter?: FhirReference;
  effectiveDateTime?: string;
  effectivePeriod?: FhirPeriod;
  issued?: string;
  performer?: FhirReference[];
  valueQuantity?: FhirQuantity;
  valueCodeableConcept?: FhirCodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  dataAbsentReason?: FhirCodeableConcept;
  interpretation?: FhirCodeableConcept[];
  note?: FhirAnnotation[];
  referenceRange?: Array<{ low?: FhirQuantity; high?: FhirQuantity; text?: string }>;
  component?: FhirObservationComponent[];
}

// FHIR Condition Resource
export interface FhirCondition {
  resourceType: 'Condition';
  id?: string;
  meta?: FhirMeta;
  identifier?: FhirIdentifier[];
  clinicalStatus?: FhirCodeableConcept;
  verificationStatus?: FhirCodeableConcept;
  category?: FhirCodeableConcept[];
  severity?: FhirCodeableConcept;
  code?: FhirCodeableConcept;
  subject: FhirReference;
  encounter?: FhirReference;
  onsetDateTime?: string;
  onsetPeriod?: FhirPeriod;
  abatementDateTime?: string;
  recordedDate?: string;
  recorder?: FhirReference;
  note?: FhirAnnotation[];
}

// FHIR MedicationRequest Resource
export interface FhirDosageInstruction {
  text?: string;
  timing?: { repeat?: { frequency?: number; period?: number; periodUnit?: string } };
  route?: FhirCodeableConcept;
  doseAndRate?: Array<{ doseQuantity?: FhirQuantity; rateQuantity?: FhirQuantity }>;
}

export interface FhirMedicationRequest {
  resourceType: 'MedicationRequest';
  id?: string;
  meta?: FhirMeta;
  identifier?: FhirIdentifier[];
  status: string;
  intent: string;
  medicationCodeableConcept?: FhirCodeableConcept;
  medicationReference?: FhirReference;
  subject: FhirReference;
  encounter?: FhirReference;
  authoredOn?: string;
  requester?: FhirReference;
  reasonCode?: FhirCodeableConcept[];
  note?: FhirAnnotation[];
  dosageInstruction?: FhirDosageInstruction[];
  dispenseRequest?: {
    validityPeriod?: FhirPeriod;
    numberOfRepeatsAllowed?: number;
    quantity?: FhirQuantity;
  };
}

// FHIR DocumentReference Resource
export interface FhirDocumentReference {
  resourceType: 'DocumentReference';
  id?: string;
  meta?: FhirMeta;
  identifier?: FhirIdentifier[];
  status: string;
  docStatus?: string;
  type?: FhirCodeableConcept;
  category?: FhirCodeableConcept[];
  subject?: FhirReference;
  date?: string;
  author?: FhirReference[];
  description?: string;
  content: Array<{ attachment: FhirAttachment; format?: FhirCoding }>;
  context?: {
    encounter?: FhirReference[];
    event?: FhirCodeableConcept[];
    period?: FhirPeriod;
    facilityType?: FhirCodeableConcept;
    practiceSetting?: FhirCodeableConcept;
  };
}

// Helper display model
export interface PatientDisplay {
  id: string;
  fullName: string;
  gender: string;
  birthDate: string;
  phone?: string;
  email?: string;
  address?: string;
  raw: FhirPatient;
}

import { Injectable } from '@angular/core';
import {
  FhirPatient,
  FhirHumanName,
  FhirAddress,
  PatientDisplay,
  FhirCodeableConcept,
  FhirEncounter,
  FhirObservation,
  FhirCondition,
  FhirMedicationRequest,
  FhirDocumentReference,
} from '../models/fhir.models';

@Injectable({ providedIn: 'root' })
export class FhirHelperService {
  // --- Patient helpers ---

  formatPatientName(names?: FhirHumanName[]): string {
    if (!names || names.length === 0) return 'Unknown';
    const official = names.find((n) => n.use === 'official') ?? names[0];
    if (official.text) return official.text;
    const given = (official.given ?? []).join(' ');
    const family = official.family ?? '';
    return [given, family].filter(Boolean).join(' ') || 'Unknown';
  }

  formatAddress(addresses?: FhirAddress[]): string {
    if (!addresses || addresses.length === 0) return '';
    const addr = addresses.find((a) => a.use === 'home') ?? addresses[0];
    if (addr.text) return addr.text;
    const parts = [
      ...(addr.line ?? []),
      addr.city,
      addr.state,
      addr.postalCode,
      addr.country,
    ].filter(Boolean);
    return parts.join(', ');
  }

  formatCodeableConcept(concept?: FhirCodeableConcept): string {
    if (!concept) return '';
    if (concept.text) return concept.text;
    if (concept.coding && concept.coding.length > 0) {
      return concept.coding[0].display ?? concept.coding[0].code ?? '';
    }
    return '';
  }

  toPatientDisplay(patient: FhirPatient): PatientDisplay {
    const phone = patient.telecom?.find((t) => t.system === 'phone')?.value;
    const email = patient.telecom?.find((t) => t.system === 'email')?.value;
    return {
      id: patient.id ?? '',
      fullName: this.formatPatientName(patient.name),
      gender: patient.gender ?? 'unknown',
      birthDate: patient.birthDate ?? '',
      phone,
      email,
      address: this.formatAddress(patient.address),
      raw: patient,
    };
  }

  // --- Encounter helpers ---

  formatEncounterStatus(encounter: FhirEncounter): string {
    return encounter.status.charAt(0).toUpperCase() + encounter.status.slice(1);
  }

  formatEncounterType(encounter: FhirEncounter): string {
    if (!encounter.type || encounter.type.length === 0) return '';
    return this.formatCodeableConcept(encounter.type[0]);
  }

  formatEncounterClass(encounter: FhirEncounter): string {
    return encounter.class?.display ?? encounter.class?.code ?? '';
  }

  // --- Observation helpers ---

  formatObservationValue(obs: FhirObservation): string {
    if (obs.valueQuantity) {
      return `${obs.valueQuantity.value ?? ''} ${obs.valueQuantity.unit ?? ''}`.trim();
    }
    if (obs.valueCodeableConcept) {
      return this.formatCodeableConcept(obs.valueCodeableConcept);
    }
    if (obs.valueString) return obs.valueString;
    if (obs.valueBoolean !== undefined) return String(obs.valueBoolean);
    if (obs.valueInteger !== undefined) return String(obs.valueInteger);
    return '';
  }

  // --- Condition helpers ---

  formatConditionStatus(condition: FhirCondition): string {
    return this.formatCodeableConcept(condition.clinicalStatus);
  }

  // --- Medication helpers ---

  formatMedicationName(med: FhirMedicationRequest): string {
    if (med.medicationCodeableConcept) {
      return this.formatCodeableConcept(med.medicationCodeableConcept);
    }
    return med.medicationReference?.display ?? 'Unknown medication';
  }

  formatDosage(med: FhirMedicationRequest): string {
    if (!med.dosageInstruction || med.dosageInstruction.length === 0) return '';
    return med.dosageInstruction[0].text ?? '';
  }

  // --- Document helpers ---

  formatDocumentType(doc: FhirDocumentReference): string {
    return this.formatCodeableConcept(doc.type);
  }

  getDocumentUrl(doc: FhirDocumentReference): string | undefined {
    return doc.content?.[0]?.attachment?.url;
  }

  // --- Date formatting ---

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatDateTime(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  calculateAge(birthDate?: string): string {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return `${age} yrs`;
  }
}

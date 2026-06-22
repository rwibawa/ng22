import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MetriportService } from '../../../core/services/metriport.service';
import { FhirHelperService } from '../../../core/services/fhir-helper.service';
import {
  PatientDisplay,
  FhirEncounter,
  FhirObservation,
  FhirCondition,
  FhirMedicationRequest,
  FhirDocumentReference,
} from '../../../core/models/fhir.models';

export type PatientTab = 'encounters' | 'conditions' | 'medications' | 'observations' | 'documents';

@Component({
  selector: 'app-patient-detail',
  imports: [RouterLink],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss',
})
export class PatientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly metriport = inject(MetriportService);
  readonly fhirHelper = inject(FhirHelperService);

  patientId = signal<string>('');
  patient = signal<PatientDisplay | null>(null);
  encounters = signal<FhirEncounter[]>([]);
  conditions = signal<FhirCondition[]>([]);
  medications = signal<FhirMedicationRequest[]>([]);
  observations = signal<FhirObservation[]>([]);
  documents = signal<FhirDocumentReference[]>([]);

  loading = signal(false);
  error = signal<string | null>(null);
  activeTab = signal<PatientTab>('encounters');

  tabs: Array<{ id: PatientTab; label: string; icon: string }> = [
    { id: 'encounters', label: 'Encounters', icon: '🏥' },
    { id: 'conditions', label: 'Conditions', icon: '📋' },
    { id: 'medications', label: 'Medications', icon: '💊' },
    { id: 'observations', label: 'Observations', icon: '🔬' },
    { id: 'documents', label: 'Documents', icon: '📄' },
  ];

  activeCount = computed(() => {
    switch (this.activeTab()) {
      case 'encounters': return this.encounters().length;
      case 'conditions': return this.conditions().length;
      case 'medications': return this.medications().length;
      case 'observations': return this.observations().length;
      case 'documents': return this.documents().length;
    }
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.patientId.set(id);
    this.loadAll(id);
  }

  loadAll(patientId: string): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      patient: this.metriport.getPatient(patientId),
      encounters: this.metriport.getPatientEncounters(patientId),
      conditions: this.metriport.getPatientConditions(patientId),
      medications: this.metriport.getPatientMedications(patientId),
      observations: this.metriport.getPatientObservations(patientId),
      documents: this.metriport.getPatientDocuments(patientId),
    }).subscribe({
      next: ({ patient, encounters, conditions, medications, observations, documents }) => {
        this.patient.set(this.fhirHelper.toPatientDisplay(patient));
        this.encounters.set((encounters.entry ?? []).map((e) => e.resource!).filter(Boolean));
        this.conditions.set((conditions.entry ?? []).map((e) => e.resource!).filter(Boolean));
        this.medications.set((medications.entry ?? []).map((e) => e.resource!).filter(Boolean));
        this.observations.set((observations.entry ?? []).map((e) => e.resource!).filter(Boolean));
        this.documents.set((documents.entry ?? []).map((e) => e.resource!).filter(Boolean));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          err?.error?.issue?.[0]?.diagnostics ??
            err?.message ??
            'Failed to load patient data.',
        );
        this.loading.set(false);
      },
    });
  }

  setTab(tab: PatientTab): void {
    this.activeTab.set(tab);
  }
}

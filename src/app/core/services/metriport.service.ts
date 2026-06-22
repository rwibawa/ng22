import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  FhirBundle,
  FhirPatient,
  FhirEncounter,
  FhirObservation,
  FhirCondition,
  FhirMedicationRequest,
  FhirDocumentReference,
} from '../models/fhir.models';

@Injectable({ providedIn: 'root' })
export class MetriportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.metriport.apiBaseUrl;
  private readonly apiKey = environment.metriport.apiKey;

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/fhir+json',
      'x-api-key': this.apiKey,
    });
  }

  // ------- Patient -------

  searchPatients(params?: {
    name?: string;
    birthdate?: string;
    gender?: string;
    identifier?: string;
    _count?: number;
  }): Observable<FhirBundle<FhirPatient>> {
    let httpParams = new HttpParams();
    if (params?.name) httpParams = httpParams.set('name', params.name);
    if (params?.birthdate) httpParams = httpParams.set('birthdate', params.birthdate);
    if (params?.gender) httpParams = httpParams.set('gender', params.gender);
    if (params?.identifier) httpParams = httpParams.set('identifier', params.identifier);
    if (params?._count) httpParams = httpParams.set('_count', String(params._count));

    return this.http.get<FhirBundle<FhirPatient>>(`${this.baseUrl}/Patient`, {
      headers: this.headers,
      params: httpParams,
    });
  }

  getPatient(patientId: string): Observable<FhirPatient> {
    return this.http.get<FhirPatient>(`${this.baseUrl}/Patient/${patientId}`, {
      headers: this.headers,
    });
  }

  // ------- Encounter -------

  getPatientEncounters(patientId: string): Observable<FhirBundle<FhirEncounter>> {
    const params = new HttpParams().set('patient', patientId).set('_sort', '-date');
    return this.http.get<FhirBundle<FhirEncounter>>(`${this.baseUrl}/Encounter`, {
      headers: this.headers,
      params,
    });
  }

  // ------- Observation -------

  getPatientObservations(
    patientId: string,
    category?: string,
  ): Observable<FhirBundle<FhirObservation>> {
    let params = new HttpParams().set('patient', patientId).set('_sort', '-date');
    if (category) params = params.set('category', category);
    return this.http.get<FhirBundle<FhirObservation>>(`${this.baseUrl}/Observation`, {
      headers: this.headers,
      params,
    });
  }

  // ------- Condition -------

  getPatientConditions(patientId: string): Observable<FhirBundle<FhirCondition>> {
    const params = new HttpParams()
      .set('patient', patientId)
      .set('_sort', '-recorded-date');
    return this.http.get<FhirBundle<FhirCondition>>(`${this.baseUrl}/Condition`, {
      headers: this.headers,
      params,
    });
  }

  // ------- MedicationRequest -------

  getPatientMedications(patientId: string): Observable<FhirBundle<FhirMedicationRequest>> {
    const params = new HttpParams()
      .set('patient', patientId)
      .set('_sort', '-authoredon');
    return this.http.get<FhirBundle<FhirMedicationRequest>>(
      `${this.baseUrl}/MedicationRequest`,
      { headers: this.headers, params },
    );
  }

  // ------- DocumentReference -------

  getPatientDocuments(patientId: string): Observable<FhirBundle<FhirDocumentReference>> {
    const params = new HttpParams().set('patient', patientId).set('_sort', '-date');
    return this.http.get<FhirBundle<FhirDocumentReference>>(
      `${this.baseUrl}/DocumentReference`,
      { headers: this.headers, params },
    );
  }

  // ------- Patient $everything -------

  getPatientEverything(patientId: string): Observable<FhirBundle<unknown>> {
    return this.http.get<FhirBundle<unknown>>(
      `${this.baseUrl}/Patient/${patientId}/$everything`,
      { headers: this.headers },
    );
  }
}

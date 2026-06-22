import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MetriportService } from '../../../core/services/metriport.service';
import { FhirHelperService } from '../../../core/services/fhir-helper.service';
import { PatientDisplay } from '../../../core/models/fhir.models';

@Component({
  selector: 'app-patient-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
})
export class PatientListComponent implements OnInit {
  private readonly metriport = inject(MetriportService);
  private readonly fhirHelper = inject(FhirHelperService);

  patients = signal<PatientDisplay[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchName = signal('');
  searchBirthdate = signal('');

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading.set(true);
    this.error.set(null);

    this.metriport
      .searchPatients({
        name: this.searchName() || undefined,
        birthdate: this.searchBirthdate() || undefined,
        _count: 20,
      })
      .subscribe({
        next: (bundle) => {
          const list = (bundle.entry ?? [])
            .map((e) => e.resource)
            .filter((r): r is NonNullable<typeof r> => !!r)
            .map((p) => this.fhirHelper.toPatientDisplay(p));
          this.patients.set(list);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(
            err?.error?.issue?.[0]?.diagnostics ??
              err?.message ??
              'Failed to load patients. Please check your API key and try again.',
          );
          this.loading.set(false);
        },
      });
  }

  onSearch(): void {
    this.loadPatients();
  }

  onClear(): void {
    this.searchName.set('');
    this.searchBirthdate.set('');
    this.loadPatients();
  }

  formatAge(birthDate: string): string {
    return this.fhirHelper.calculateAge(birthDate);
  }

  formatDate(date: string): string {
    return this.fhirHelper.formatDate(date);
  }
}

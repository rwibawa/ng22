import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'patients',
    loadComponent: () =>
      import('./features/patients/patient-list/patient-list.component').then(
        (m) => m.PatientListComponent,
      ),
  },
  {
    path: 'patients/:id',
    loadComponent: () =>
      import('./features/patients/patient-detail/patient-detail.component').then(
        (m) => m.PatientDetailComponent,
      ),
  },
  { path: '**', redirectTo: 'dashboard' },
];

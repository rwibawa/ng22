import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  cards: DashboardCard[] = [
    {
      title: 'Patients',
      description: 'Search and manage patient records',
      icon: '👥',
      route: '/patients',
      color: '#1a6b8a',
    },
    {
      title: 'Encounters',
      description: 'View patient encounters and visits',
      icon: '🏥',
      route: '/patients',
      color: '#2a9d8f',
    },
    {
      title: 'Conditions',
      description: 'Track active and historical conditions',
      icon: '📋',
      route: '/patients',
      color: '#e76f51',
    },
    {
      title: 'Medications',
      description: 'Review medication requests and orders',
      icon: '💊',
      route: '/patients',
      color: '#457b9d',
    },
    {
      title: 'Observations',
      description: 'Lab results and vital signs',
      icon: '🔬',
      route: '/patients',
      color: '#6a4c93',
    },
    {
      title: 'Documents',
      description: 'Clinical documents and reports',
      icon: '📄',
      route: '/patients',
      color: '#f4a261',
    },
  ];
}

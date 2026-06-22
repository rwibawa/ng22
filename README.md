# MedClinic — Angular 22 FHIR Patient Management

A medical clinic application built with **Angular 22** that consumes the **[Metriport](https://metriport.com) FHIR R4 API** to provide comprehensive patient health data management.

## Features

- **Patient Search** — Search and browse patient records by name or date of birth
- **Patient Detail** — Full patient profile with tabbed sections:
  - 🏥 **Encounters** — Clinical visits and hospitalizations
  - 📋 **Conditions** — Active and historical diagnoses
  - 💊 **Medications** — Medication requests and prescriptions
  - 🔬 **Observations** — Lab results and vital signs
  - 📄 **Documents** — Clinical documents and reports
- Lazy-loaded routes for optimal performance
- Responsive design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 22 (standalone components) |
| API | Metriport FHIR R4 (`https://api.metriport.com/fhir/R4`) |
| Styling | SCSS |
| Testing | Vitest + Angular Testing Library |
| HTTP | Angular `HttpClient` |

## Getting Started

### Prerequisites

- Node.js 22+
- A [Metriport](https://app.metriport.com) account with an API key

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your Metriport API key:**

   Edit `src/environments/environment.ts` and set your API key:
   ```typescript
   export const environment = {
     production: false,
     metriport: {
       apiBaseUrl: 'https://api.metriport.com/fhir/R4',
       apiKey: 'YOUR_METRIPORT_API_KEY',
     },
   };
   ```

3. **Run the development server:**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200`.

### Running Tests

```bash
npm test
```

### Production Build

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   └── fhir.models.ts          # FHIR R4 TypeScript interfaces
│   │   └── services/
│   │       ├── metriport.service.ts     # Metriport FHIR API client
│   │       └── fhir-helper.service.ts   # Display formatting utilities
│   ├── features/
│   │   ├── dashboard/                   # App dashboard
│   │   └── patients/
│   │       ├── patient-list/            # Patient search & listing
│   │       └── patient-detail/          # Patient detail with resource tabs
│   └── shared/
│       └── components/nav/              # Navigation bar
└── environments/
    ├── environment.ts                   # Development config
    └── environment.prod.ts              # Production config
```

## FHIR Resources

This application integrates the following FHIR R4 resources via the Metriport API:

| Resource | Endpoint |
|----------|----------|
| Patient | `GET /Patient`, `GET /Patient/:id` |
| Encounter | `GET /Encounter?patient=:id` |
| Condition | `GET /Condition?patient=:id` |
| MedicationRequest | `GET /MedicationRequest?patient=:id` |
| Observation | `GET /Observation?patient=:id` |
| DocumentReference | `GET /DocumentReference?patient=:id` |
| Patient Everything | `GET /Patient/:id/$everything` |

## License

MIT

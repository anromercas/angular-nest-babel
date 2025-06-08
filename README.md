# Candidate Management Application

This repository contains two Dockerized projects:

**Backend** (`candidate-api`): REST API built with NestJS to process elements of a form and an .xls or .xlsx file and return the processed data in json.
**Frontend** (`candidate-frontend`): Client application in Angular to interact with the API, display a list of candidates and add candidates from a form.

---

## Backend (`candidate-api`)

### What does it do?

El backend expone un endpoint `/candidates` que permite:

1. **Upload an Excel file** with a candidate's information (seniority, years of experience, availability) and two fields of a form (first and last name).
2. **Process** the Excel buffer, extract the data and return a JSON with the excel and form information.
3. **Persistence**: currently in memory (or localStorage in frontend), but it is easily extensible to database.

### Technologies

* **NestJS** (TypeScript)
* **Jest** for unit tests
* **xlsx** for Excel file parsing
* **Docker multi-stage builds**

---

## Frontend (`candidate-frontend`)

### What does it do?

The UI allows:

1. **Add candidates** by entering first and last name and uploading an Excel file.
2. **List** the added candidates with pagination and highlighting of the last record.
3. **Persistence in `localStorage`** (demo), with the possibility of using other strategies.
4. **State management** using Angular Signals.

### Technologies

* **Angular 16** with Standalone Components
* **Signals** for status management
* **Jest** + **ts-jest** for tests
* **Angular Material** for UI components
* **Docker + Nginx** for static file serving

---

## Requirements

* **Docker** (v20+) y **Docker Compose** (v1.29+)
* A machine running **Linux**, **macOS** or **Windows 10+** with WSL2

---

## Running with Docker Compose

1. Clone the repository:

   ```bash
   git clone <url-repository-url>
   cd <repository>
   ```
2. Pull up the containers:

   ```bash
   docker compose up --build -d
   ```
3. Accede a:

   * **Frontend**: [http://localhost:4200](http://localhost:4200)
   * **Backend**: [http://localhost:3000](http://localhost:3000)

To stop and eliminate containers:

```bash
docker-compose down
```

---

## Folder structure

```
/  
├─ candidate-api/ # NestJS backend code.
│ ├─ src/ # Drivers, services, modules.
│ ├─ test/ # Jest tests
│ ├─ Dockerfile # Multi-stage build for backend.
│ └─ package.json # Dependencies and scripts.
│
├─ candidate-frontend/ # Angular frontend code.
│ ├─ src/ # Components, services, models.
│ ├─ e2e/ # End-to-end tests (if applicable).
│ ├─ Dockerfile # Multi-stage build + Nginx
│ └─ angular.json # Angular configuration
│
└─ docker-compose.yaml # Service orchestration.
```

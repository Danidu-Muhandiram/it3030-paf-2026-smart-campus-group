# Smart Campus Operations Hub

Monorepo containing the backend Spring Boot service and the React (Vite) frontend for the Smart Campus Operations Hub.

## Project Structure

```
.
├── backend/                      # Spring Boot application (Java 21)
│   ├── pom.xml                   # Maven project descriptor
│   └── src/
│       ├── main/java/com/smartcampus/
│       │   ├── backend/          # `BackendApplication` entry point
│       │   ├── config/           # CORS and future security configs
│       │   ├── controller/       # REST controllers (e.g., `HealthController`)
│       │   ├── dto/              # Response wrappers (`ApiResponse`) and future DTOs
│       │   ├── entity/           # Domain models (placeholder)
│       │   ├── exception/        # Global exception handler
│       │   ├── mapper/           # Mapping utilities (placeholder)
│       │   ├── repository/       # Spring Data repositories (placeholder)
│       │   ├── security/         # Security setup (placeholder)
│       │   └── service/impl/     # Business logic implementations (placeholder)
│       └── main/resources/
│           ├── application.yml   # Primary Spring configuration
│           ├── application.properties
│           └── static|templates  # Static assets placeholders
│
├── frontend/                     # React + TypeScript app scaffolded with Vite
│   ├── package.json              # npm scripts and dependencies
│   ├── vite.config.ts            # Vite configuration
│   ├── tsconfig*.json            # TypeScript configs
│   ├── public/
│   └── src/
│       ├── api/                  # Axios instances and API helpers (placeholder)
│       ├── auth/                 # Future auth helpers/guards
│       ├── components/           # Shared UI components
│       ├── pages/                # Route-level screens
│       ├── routes/               # React Router configuration
│       ├── layout/               # Layout shells/navigation
│       ├── context/              # React context providers
│       ├── App.tsx               # Root component
│       └── main.tsx              # Entry point
│
├── docs/                         # Additional documentation (if any)
└── README.md                     # This document
```

## Current Backend Highlights

| Component | File | Notes |
| --- | --- | --- |
| Spring Boot entry point | `backend/src/main/java/com/smartcampus/backend/BackendApplication.java` | Boots the service with `SpringApplication.run(...)`. |
| CORS configuration | `backend/src/main/java/com/smartcampus/config/CorsConfig.java` | Allows the Vite dev server (`http://localhost:5173`) with CRUD verbs and credentials. |
| Health endpoint | `backend/src/main/java/com/smartcampus/controller/HealthController.java` | `GET /api/health` returns a simple JSON payload confirming uptime. |
| API response wrapper | `backend/src/main/java/com/smartcampus/dto/ApiResponse.java` | Provides a consistent response shape with `success`, `message`, `data`, and timestamp. |
| Global exception handler | `backend/src/main/java/com/smartcampus/exception/GlobalExceptionHandler.java` | Handles validation failures and unexpected errors. |

## Current Frontend Highlights

- Generated with Vite + React + TypeScript (`npm create vite@latest frontend -- --template react-ts`).
- Base folders inside `frontend/src` already created for `api`, `auth`, `components`, `pages`, `routes`, `layout`, and `context`.
- Core dependencies installed:
  - `axios`
  - `react-router-dom`

## Running the Apps

**Backend**
```
cd backend
mvn spring-boot:run
```
Defaults to `http://localhost:8080`.

**Frontend**
```
cd frontend
npm install
npm run dev
```
Serves on `http://localhost:5173`.

Adjust environment-specific settings inside `backend/src/main/resources/application.yml` and future frontend environment files as features are added.

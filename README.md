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
├── frontend/                     # React (JavaScript) app scaffolded with Vite
│   ├── package.json              # npm scripts and dependencies
│   ├── vite.config.js            # Vite configuration with Tailwind CSS plugin
│   ├── public/                   # Static assets
│   └── src/
│       ├── app/                  # App-level setup (App.jsx, routes.jsx)
│       ├── assets/               # Images, logos
│       ├── components/           # Shared reusable components
│       │   ├── ui/               # Button, Input, Card, etc.
│       │   └── layout/           # Sidebar, Footer, etc.
│       ├── features/             # Business modules (e.g., auth)
│       ├── services/             # Axios config (axios.js)
│       ├── styles/               # Global styles (global.css)
│       └── main.jsx              # Entry point
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
| Database configuration | `backend/src/main/resources/application.yml` | Configured for MySQL (`jdbc:mysql://localhost:3306/smartcampus`) with `ddl-auto=update` and SQL logging enabled. |

### Backend Database Setup

1. Install MySQL 8.x (or compatible) locally and ensure it is running on port `3306`.
2. Create an empty schema named `smartcampus` (matching the JDBC URL in `application.yml`).
3. Update the `spring.datasource.username` and `spring.datasource.password` fields in `backend/src/main/resources/application.yml` to match your local credentials.
4. Optional: adjust the Hibernate dialect or `ddl-auto` strategy in the same file if you need stricter schema management.

> The backend already includes the `mysql-connector-j` runtime dependency in `backend/pom.xml`, so no extra driver installation is required.

## Current Frontend Highlights

- Generated with Vite + React (JavaScript) (`npm create vite@latest frontend -- --template react`).
- Modular architecture organizing logic by features, with app-level routing, services, and shared UI components.
- Core dependencies installed:
  - `react-router-dom` v6+
  - `tailwindcss` (with `@tailwindcss/vite`)
  - `axios`

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

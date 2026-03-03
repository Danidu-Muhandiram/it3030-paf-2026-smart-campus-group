# it3030-paf-2026-smart-campus-group

Smart Campus backend built with Spring Boot 3 / Java 21. This document focuses on the backend module that lives in `backend/`.

## Backend Folder Structure

```
backend/
├── pom.xml                     # Maven parent for the backend service
├── src/
│   ├── main/java/com/smartcampus/
│   │   ├── backend/            # Spring Boot entry point
│   │   ├── config/             # Cross-cutting configs (CORS, security, etc.)
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Request/response payload models
│   │   ├── entity/             # Persistence layer (empty placeholder)
│   │   ├── exception/          # Global exception handling
│   │   ├── mapper/             # MapStruct or manual mappers (placeholder)
│   │   ├── repository/         # Spring Data repositories (placeholder)
│   │   ├── security/           # Security configs (placeholder)
│   │   └── service/impl/       # Business services (placeholder)
│   ├── main/resources/
│   │   ├── application.yml     # Primary Spring configuration
│   │   ├── application.properties
│   │   └── static|templates    # Web assets if needed
│   └── test/java/...           # Spring Boot tests
└── target/                     # Maven build outputs
```

## Key Implementations

| Component | Location | Purpose |
| --- | --- | --- |
| Spring Boot entry point | `src/main/java/com/smartcampus/backend/BackendApplication.java` | Boots the backend service via `SpringApplication.run(...)`. |
| CORS configuration | `src/main/java/com/smartcampus/config/CorsConfig.java` | Registers a `WebMvcConfigurer` bean that allows the Vite frontend (`http://localhost:5173`) to access all endpoints with standard CRUD verbs and credentials. |
| Health endpoint | `src/main/java/com/smartcampus/controller/HealthController.java` | Exposes `GET /api/health` returning a simple JSON payload confirming the service is online. |
| Standard API envelope | `src/main/java/com/smartcampus/dto/ApiResponse.java` | Generic wrapper with `success`, `message`, `data`, and a server `timestamp` used to standardize responses. |
| Global exception handling | `src/main/java/com/smartcampus/exception/GlobalExceptionHandler.java` | Captures validation failures (`MethodArgumentNotValidException`) and unexpected exceptions, returning structured error payloads. |

All other packages (`entity`, `repository`, `service`, etc.) are scaffolded for upcoming features but intentionally empty right now.

## Running the Backend Locally

Prerequisites: JDK 21+, Maven 3.9+, and a Java-friendly IDE or VS Code with the Java extension pack.

```bash
cd backend
mvn spring-boot:run
```

The service starts on `http://localhost:8080` by default. Use `mvn clean package` to produce a runnable jar in `backend/target/`.

### Health Check

```
GET http://localhost:8080/api/health

{
	"success": true,
	"message": "Backend running"
}
```

## Configuration Notes

- `application.yml` / `application.properties` control datasource, logging, and feature flags. Keep environment-specific overrides outside version control (e.g., `application-dev.yml`).
- CORS origins are locked to `http://localhost:5173`; update `CorsConfig` when deploying to other hosts.
- Add `hs_err_pid*.log` to `.gitignore` (already done via history rewrite) so JVM crash logs do not reappear.

## Next Steps

- Flesh out `entity`, `repository`, and `service` layers as new modules (attendance, facilities, etc.) come online.
- Expand the test suite under `src/test/java` once business logic is added.
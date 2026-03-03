# Smart Campus Operations Hub

Team playbook for building a full-stack Smart Campus platform (facilities, booking, ticketing, auth, notifications). Use this README as the single source of truth for processes, structure, and expectations.

---

## 📌 Project Overview

- Facilities & resource management
- Booking with conflict detection
- Ticketing & workflow escalation
- Authentication with role-based access (ADMIN, STAFF, STUDENT)
- System-wide notifications

## 🏗 Architecture Overview

**Backend**
- Spring Boot 3 (Java 21 currently, 17+ compatible)
- PostgreSQL + Spring Data JPA (Hibernate)
- Spring Security + OAuth2 Client
- Validation, Lombok, Spring Boot Test

**Frontend**
- React + TypeScript via Vite
- Axios for HTTP
- React Router for routing
- Context API (or Redux if needed later)

---

## 🌳 Git Branching Strategy

**Main branches**
- `main`  → production-ready
- `develop` → integration branch for day-to-day work

**Module branches**
- `feature/facilities-module`
- `feature/booking-module`
- `feature/ticketing-module`
- `feature/auth-notification-module`

### 🔒 Branch Protection Rules

**main**
- ❌ No direct pushes
- ✅ Pull request + review + passing checks
- ✅ Linear history required

**develop**
- ❌ No direct pushes
- ✅ Pull request + review

### 🚀 Development Workflow (mandatory)
1. Clone repo and stay inside project root.
2. Create feature branch from `develop`.
3. Build and test locally.
4. Commit with meaningful message.
5. Push branch and open PR → `develop`.
6. Get review, address feedback, then merge via PR.

---

## 🖥 Project Setup

```bash
git clone <repo-url>
cd it3030-paf-2026-smart-campus-group
```

### Backend Setup (`/backend`)
1. Use Spring Initializr (already done) with dependencies:
	 - Spring Web, Spring Data JPA, PostgreSQL, Validation, Lombok, Spring Security, OAuth2 Client, Spring Boot Test
2. Folder structure:

```
backend/src/main/java/com/smartcampus
├── backend           # Spring Boot entry point
├── config            # CORS, security, etc.
├── controller        # REST controllers
├── service           # Service interfaces & impl
├── repository        # Spring Data repositories
├── entity            # JPA entities
├── dto               # Request/response models
├── exception         # Global handlers
└── util              # Helpers
```

3. Base `application.yml`

```yaml
spring:
	datasource:
		url: jdbc:postgresql://localhost:5432/smartcampus
		username: postgres
		password: yourpassword
	jpa:
		hibernate:
			ddl-auto: update
		show-sql: true
		properties:
			hibernate:
				format_sql: true
```

4. Must-have configs before feature work:
- Global exception handler (`GlobalExceptionHandler`)
- Standard API response DTO (`ApiResponse`)
- CORS config (`CorsConfig`) opening `http://localhost:5173`
- Basic security config (role setup stubs)
- Health check at `/api/health`
- Build success via `mvn spring-boot:run`

### Backend Key Files (current)

| Component | Location | Notes |
| --- | --- | --- |
| Entry point | `backend/src/main/java/com/smartcampus/backend/BackendApplication.java` | Boots the service. |
| CORS config | `backend/src/main/java/com/smartcampus/config/CorsConfig.java` | Enables Vite dev origin + CRUD verbs. |
| Health endpoint | `backend/src/main/java/com/smartcampus/controller/HealthController.java` | `GET /api/health` for uptime probing. |
| API envelope | `backend/src/main/java/com/smartcampus/dto/ApiResponse.java` | Consistent payload shape. |
| Global errors | `backend/src/main/java/com/smartcampus/exception/GlobalExceptionHandler.java` | Handles validation + generic errors. |

Run locally:

```bash
cd backend
mvn spring-boot:run
```

### Frontend Setup (`/frontend`)

We already scaffolded Vite React TS.

```bash
cd frontend
npm install
npm run dev
```

Frontend directory layout:

```
frontend/
├── package.json
├── vite.config.ts
├── tsconfig*.json
├── public/
└── src/
		├── api/        # Axios base instances
		├── auth/       # Guards, auth flows
		├── components/ # Shared UI
		├── pages/      # Screen-level routes
		├── routes/     # Router config
		├── layout/     # Shells, nav
		├── context/    # React contexts
		├── App.tsx
		└── main.tsx
```

Core libs installed:
- `axios`
- `react-router-dom`

Next steps:
- Create `src/api/axios.ts` with `baseURL: http://localhost:8080/api`.
- Wire routing for login, dashboard, facilities, booking, ticketing.

---

## 🧱 Step 1 — Base Project Finalization

Before any module starts:
- Backend boots and connects to DB
- Frontend `npm run dev` works
- Database reachable (PostgreSQL running)
- Basic routing (landing/login) renders
- Security config loads without errors
- Commit: `chore: initial backend and frontend setup` pushed to `develop`

---

## 🧑‍💻 Module Development Process

### Standard workflow
1. `git checkout develop && git pull origin develop`
2. `git checkout feature/<module>` (create if missing)
3. `git merge develop` to stay current
4. Implement feature (entity → repository → service → controller → DTO → validation)
5. `git add .` + `git commit -m "feat: implement <feature>"`
6. `git push origin feature/<module>`
7. Open PR targeting `develop` with description, API list, screenshots/tests
8. Reviewer checks naming, validation, security, layering, console noise
9. Merge only after review approval + passing checks

### Commit message keywords
- `feat:` new functionality
- `fix:` bug fix
- `refactor:` internal improvement
- `chore:` setup/config/tooling

---

## 🧠 Development Rules

**Never**
- Push directly to `main` or `develop`
- Mix multiple modules in one branch
- Commit without context
- Leave debug logs or unused code

**Always**
- Pull latest `develop` before coding
- Write small, meaningful commits
- Cover logic with tests where applicable
- Use DTOs instead of exposing entities
- Validate all inputs (backend + frontend)

---

## 🗃 Database Guidelines
- Model foreign keys explicitly
- Create indexes for search-heavy columns
- Enforce unique constraints (e.g., booking slots)
- Implement booking conflict detection in services
- Include audit fields (`createdAt`, `updatedAt`)

## 🔐 Security Guidelines
- Role-based access control (ADMIN/STAFF/STUDENT)
- Protect endpoints with annotations and method-level checks
- Do not expose sensitive data in DTOs/logs
- Hash passwords (BCrypt) and secure secrets

## 🧪 Testing Guidelines
- Backend: unit tests for services, especially booking conflict logic
- Frontend: form validation, API error handling, routing guards
- Ensure `mvn test` and `npm run test` (when added) pass before PR

---

## 📦 Pre-Submission Checklist
- All modules merged into `develop`
- `develop` merged into `main` (via PR)
- Zero merge conflicts
- No console or server errors
- Database schema + ER diagram documented
- API documentation ready (Swagger/Postman)

### Final release

```bash
git checkout main
git merge develop
git push origin main
```

`main` must remain production-stable.

---

## 🧭 Team Responsibility Model

| Role | Ownership |
| --- | --- |
| Team Lead | Branch control, PR approvals, release coordination |
| Backend Devs | Entities, repositories, services, security |
| Frontend Devs | UI, routing, API integration |
| Reviewer | Code quality, validation, security checklist |

---

## 🎯 Professional Mindset & Final Goal
- Clean architecture and layering
- Disciplined Git workflow
- Strong relational schema with documentation
- Secure backend foundations
- Structured frontend ready for demos
- Clear, reviewable history and documentation for viva/demo

Stay consistent with this guide so every teammate can contribute confidently.
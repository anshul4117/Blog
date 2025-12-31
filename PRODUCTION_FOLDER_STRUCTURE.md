# Production Folder Structure: Complete Reference

A production-ready Node.js project structure with clear separation of concerns, infrastructure as code, and CI/CD automation.

---

## Complete Folder Tree

```
server/
├── src/
│   ├── app.js                      # Express app setup (routes & middleware registration)
│   ├── server.js                   # Server entry point & DB connection initialization
│   ├── config/                     # Configuration management
│   │   ├── index.js                # Central config loader (env-first, validated)
│   │   ├── logger.js               # Structured logger configuration (Pino/Winston)
│   │   ├── db.js                   # Database connection settings
│   │   └── redisClient.js          # Redis cache client initialization
│   ├── routes/                     # API route definitions
│   ├── controllers/                # HTTP request handlers (thin layer)
│   │   ├── user/                   # User domain controllers
│   │   ├── blog/                   # Blog domain controllers
│   │   └── explore/                # Explore/discover domain controllers
│   ├── services/                   # Business logic & orchestration
│   ├── models/                     # Database schemas (Mongoose models)
│   ├── repositories/               # Data access layer (DB queries, abstractions)
│   ├── middleware/                 # Express middleware (auth, validation, error handling)
│   ├── validators/                 # Request & domain validation schemas (Joi/Zod)
│   ├── errors/                     # Custom error classes & HTTP mappings
│   ├── jobs/                       # Background jobs & scheduled workers (Bull/Agenda)
│   ├── tasks/                      # CLI utilities (migrations, maintenance scripts)
│   ├── utils/                      # Helper functions & utilities
│   │   └── helper/                 # Pure utility functions (cache helpers, formatters)
│   └── public/                     # Static assets (if served by app)
├── tests/                          # Test suite root
│   ├── unit/                       # Unit tests (services, utils, helpers)
│   │   ├── services/
│   │   ├── utils/
│   │   └── helpers/
│   ├── integration/                # Integration tests (routes, controllers, end-to-end)
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── api/
│   └── fixtures/                   # Test data, mocks, and sample payloads
├── infra/                          # Infrastructure-as-code
│   ├── kubernetes/                 # Kubernetes manifests & Helm charts
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── configmap.yaml
│   │   └── values.yaml
│   └── terraform/                  # Terraform modules & state config
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── docker/                         # Containerization
│   ├── Dockerfile                  # Production multi-stage build
│   ├── Dockerfile.dev              # Development image with hot-reload
│   └── .dockerignore               # Docker build exclusions
├── .github/                        # GitHub repository configuration
│   └── workflows/                  # CI/CD pipelines
│       ├── test.yml                # Unit & integration tests on PR
│       ├── build.yml               # Build & push container image
│       └── deploy.yml              # Deploy to production
├── ci/                             # CI-specific scripts & helpers
├── scripts/                        # Local automation & utility scripts
├── logs/                           # Runtime logs (gitignored, use stdout in production)
│   └── .gitkeep
├── coverage/                       # Test coverage reports (gitignored)
│   └── .gitkeep
├── .env.example                    # Example environment variables (no secrets)
├── .eslintrc.js                    # ESLint configuration
├── package.json                    # Dependencies & scripts
├── package-lock.json               # Locked dependency versions
├── README.MD                       # Project documentation
└── PRODUCTION_FOLDER_STRUCTURE.md  # This file
```

---

## Detailed Purpose, Use, and Controls

### `src/` — Application Source Code

**Purpose:** All production code that gets containerized.

**Use:**
- Keep `app.js` and `server.js` lightweight (< 50 lines each).
- Wire routes, middleware, dependency injection, then exit — all real logic lives in services.
- Use strict layering: HTTP layer → Service layer → Repository layer → Data layer.

**Controls:**
- No direct database queries in controllers or routes.
- No business logic in middleware.
- Config must load from environment first; fail fast if required vars are missing.
- Secrets never hardcoded; reference secret manager paths (Vault, K8s Secrets, AWS Secrets Manager).
- All async operations must have timeout controls and retry logic.

---

### `src/config/` — Configuration Management

**Purpose:** Centralized, environment-aware configuration.

**Use:**
- `index.js`: Load from env, validate with schema, return frozen config object.
- `logger.js`: Singleton logger instance, structured JSON output for container log collectors.
- Database, Redis, and third-party service configs separate and modular.

**Controls:**
- Validate all required environment variables at startup; crash if missing.
- Support multiple environments (dev, staging, prod) via env-based overrides.
- Log level configurable via `LOG_LEVEL` env var (default: 'info').
- Never log sensitive values; sanitize in serializers.

---

### `src/routes/` — Route Definitions

**Purpose:** Map HTTP paths to handlers; thin composition layer.

**Use:**
- Define routes, attach validators and middleware in sequence.
- Keep route handlers under 5 lines — delegate to controllers.
- Group routes by domain (user, blog, explore).

**Controls:**
- Use consistent naming (`GET /users/:id`, `POST /blogs`).
- Attach request validation schemas to each route.
- Require authentication middleware where needed.
- Document expected request/response schemas (OpenAPI/Swagger).

---

### `src/controllers/` — Request Handlers

**Purpose:** Parse HTTP requests, orchestrate services, format responses.

**Use:**
- Validate incoming data (delegating to validators).
- Call appropriate service method.
- Map domain errors to HTTP status codes.
- Return consistent response envelope.

**Controls:**
- Never query DB directly; use repositories via services.
- Transform service responses into DTO/HAL format for HTTP clients.
- Catch and log errors; map to appropriate HTTP status (400, 404, 500, etc.).
- Keep controllers under 30 lines each.

---

### `src/services/` — Business Logic

**Purpose:** Domain rules, orchestration, integration with external systems.

**Use:**
- Implement use cases: create blog, update profile, send notifications.
- Coordinate multiple repositories and external APIs.
- Handle transactions and saga patterns for multi-step operations.
- Emit domain events (user registered, blog published) for listeners.

**Controls:**
- Pure functions with no HTTP knowledge.
- Implement retry logic for transient failures (databases, APIs).
- Use idempotency keys for external API calls.
- Log significant state changes and business events.
- Unit-test services extensively.

---

### `src/models/` & `src/repositories/`

**Purpose:** `models/` define schemas and validation; `repositories/` abstract data access.

**Use:**
- Models: Define Mongoose schemas, indexes, validation rules.
- Repositories: Implement create, read, update, delete, and complex queries.
- Return domain objects (not raw DB documents).

**Controls:**
- Parameterize all queries to prevent SQL/NoSQL injection.
- Implement pagination with cursor or offset strategies.
- Cache frequently accessed data via repositories.
- Add retry and backoff in repository adapters for transient DB errors.

---

### `src/middleware/` — Cross-cutting Concerns

**Purpose:** Auth, logging, validation, rate limiting, error handling.

**Use:**
- Authentication: verify JWT tokens, attach user context.
- Request logging: log method, path, status, duration.
- Rate limiting: global and per-user limits.
- Error handling: catch exceptions, format errors, set status codes.

**Controls:**
- Apply middleware in order: logging → auth → validation → business routes → error handler.
- Fail fast on validation errors (return 400).
- Log auth failures without leaking sensitive info.
- Implement graceful rate-limit responses (429 with Retry-After header).

---

### `src/validators/` — Request Validation

**Purpose:** Schema definitions for request payloads.

**Use:**
- Define Joi/Zod schemas for each route.
- Validate query params, body, headers.
- Provide clear error messages for client feedback.

**Controls:**
- Fail validation on first error (fail-fast).
- Whitelist allowed fields; reject extras.
- Sanitize string inputs (trim, lowercase where applicable).
- Enforce type coercion (string to number) only where safe.

---

### `src/errors/` — Error Classes

**Purpose:** Typed domain errors and HTTP status mappings.

**Use:**
- Define `ValidationError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`, etc.
- Include error code and message for API consumers.
- Map errors to HTTP status codes.

**Controls:**
- Never expose internal stack traces in production responses.
- Include request ID in error responses for tracing.
- Log full error context server-side for debugging.

---

### `src/jobs/` — Background Work

**Purpose:** Scheduled jobs, queue workers, long-running tasks.

**Use:**
- Send emails, generate reports, sync external services.
- Process user events asynchronously (job queue: Bull, Agenda, BullMQ).
- Must be runnable as separate deployment (worker pods).

**Controls:**
- Jobs must be idempotent (safe to retry).
- Log job start, progress, and completion.
- Respect process signals (SIGTERM) for graceful shutdown.
- Set reasonable timeouts and max retries.
- Monitor job queue depth and failure rates.

---

### `src/tasks/` — CLI Utilities

**Purpose:** Ad-hoc maintenance and setup scripts.

**Use:**
- Database migrations, schema changes.
- Data fixes, bulk operations, maintenance.
- One-off scripts for ops or dev tasks.

**Controls:**
- Must be idempotent and documented in `README.MD`.
- Ask for confirmation before destructive operations.
- Log all changes for audit.

---

### `src/utils/` & `src/utils/helper/`

**Purpose:** Pure utility functions, no side effects.

**Use:**
- Date formatting, string transformations.
- Cache helpers (TTL, key generation).
- Common calculations, formatters.

**Controls:**
- Keep functions small and testable.
- Avoid I/O or external calls.
- Document assumptions and edge cases.
- Unit-test all helpers.

---

### `src/public/` — Static Assets

**Purpose:** Serve static files (if needed; prefer CDN in production).

**Use:**
- Images, CSS, JavaScript bundles (for SPA or frontend served with API).
- Should be small and immutable.

**Controls:**
- Serve with long cache headers (Cache-Control: max-age=31536000 for hashed assets).
- Compress (gzip, brotli) in production.
- Use CDN for geo-distribution.

---

### `tests/` — Test Suite

**Purpose:** Regression protection, code confidence, and fast feedback.

**Use:**
- Unit tests: services, helpers, validators (mock repositories).
- Integration tests: routes and controllers (real or in-memory test DB).
- Fixtures: test data, factory functions, sample payloads.

**Controls:**
- Run unit tests on every PR (fast feedback).
- Run integration tests on merge (slower, gated).
- Isolate tests: use separate test DB or ephemeral instances.
- Aim for >80% code coverage for critical paths.
- Use fixtures for consistency and DRY test data.

---

### `infra/` — Infrastructure-as-Code

**Purpose:** Reproducible, version-controlled infrastructure.

**Use:**
- **Kubernetes:** Define deployments, services, configmaps, secrets references, resource quotas.
- **Terraform:** Provision cloud resources, networking, databases, load balancers.

**Controls:**
- Store Terraform state in remote backend (S3 + DynamoDB locks; never commit state).
- Separate configs per environment (dev, staging, prod) using overlays or workspaces.
- Define readiness/liveness probes for k8s.
- Define resource requests and limits for scheduling.
- Reference secrets via secret manager paths, not inline.
- Review all infra changes in PRs before applying.

---

### `docker/` — Containerization

**Purpose:** Build consistent, minimal, secure container images.

**Use:**
- **Dockerfile (production):** Multi-stage build, copy only needed artifacts, run as non-root user.
- **Dockerfile.dev:** Dev-friendly with hot-reload, dev dependencies, debugger.
- **.dockerignore:** Exclude node_modules, logs, .env, local artifacts.

**Controls:**
- Use lightweight base image (Node Alpine or Debian slim).
- Multi-stage: build in large stage, copy artifacts to small stage.
- Set `NODE_ENV=production` in production image.
- Run as non-root user (USER appuser).
- Do not bake secrets into images.
- Scan images with Trivy or similar before pushing to registry.
- Tag images immutably: `registry/app:sha-<commit-hash>` and optionally `registry/app:v1.2.3`.

---

### `.github/workflows/` — CI/CD Pipelines

**Purpose:** Automate testing, building, and deployment.

**Use:**
- **test.yml:** On every PR — run linting, unit tests, coverage checks.
- **build.yml:** On merge to main — build image, run vulnerability scans, push to registry.
- **deploy.yml:** Manual or auto-trigger — deploy to k8s, run integration tests, health checks.

**Controls:**
- Require all checks to pass before merging to main.
- Use branch protection rules.
- Deploy only signed/verified images.
- Require manual approval for production deploys.
- Log all deployments; include deployment context (commit, actor, environment).

---

### `ci/` — CI Helpers

**Purpose:** Shared scripts and helpers for CI/CD pipelines.

**Use:**
- Deployment scripts, image build helpers, health checks.
- Shared by GitHub Actions workflows.

---

### `scripts/` — Local Automation

**Purpose:** Developer-friendly scripts for setup, testing, cleanup.

**Use:**
- `setup.sh`: Install dependencies, set up local env, seed test DB.
- `migrate.sh`: Run database migrations locally.
- `seed.sh`: Populate test data.

**Controls:**
- Document all scripts in `README.MD`.
- Make scripts idempotent.
- Use clear, descriptive names.

---

### `logs/` & `coverage/` — Runtime Artifacts

**Purpose:** Store logs and test coverage reports (not in version control).

**Use:**
- `logs/`: Application logs (in production, log to stdout for container collection).
- `coverage/`: Test coverage reports generated by CI.

**Controls:**
- Add both to `.gitignore`.
- Use `.gitkeep` if you need the directory to exist for some tooling.
- In production, use a log collector (Fluentd, Fluent Bit) to ship logs to central store (Elasticsearch, Datadog).
- Rotate and expire logs at the collector level, not on the pod filesystem.

---

### Root Configuration Files

- **`.env.example`:** Document all environment variables; no secrets, only variable names and defaults.
- **`.eslintrc.js`:** Code style rules; enforce in CI.
- **`package.json`:** Dependencies, scripts (`npm start`, `npm test`, `npm run lint`), metadata.
- **`README.MD`:** Project overview, setup instructions, API docs, runbook.

---

## Governance & Run Controls (Cross-cutting)

### Code Review
- Require CODEOWNERS for `src/`, `infra/`, `.github/`.
- All PRs must pass automated checks and receive at least one approval.

### Secrets Management
- Never commit secrets; use a secret manager (HashiCorp Vault, AWS Secrets Manager, K8s Secrets).
- Reference secrets by path in configuration.
- Rotate secrets regularly; monitor access.

### Dependency Management
- Run `npm audit` regularly; fix high-severity vulnerabilities.
- Use dependabot or renovate for automated updates.
- Pin major versions; allow minor/patch auto-updates for dev dependencies.

### Monitoring & Alerting
- Define SLOs (error rate < 0.1%, p99 latency < 500ms).
- Alert on: high error rate, latency spikes, resource exhaustion, service downtime.
- Log all business-critical events (user signup, payment, auth failure).

### Deployment Strategy
- Use canary or blue-green deployments for production.
- Monitor error rates and latency during deployment; auto-rollback if thresholds exceeded.
- Database migrations: run in separate controlled windows, use feature flags for schema changes.
- Graceful shutdown: drain in-flight requests (30-60s timeout), stop accepting new connections.

---

## Quick Setup Reference

Create the skeleton locally:

```bash
mkdir -p src/{config,routes,controllers,services,models,repositories,middleware,validators,errors,jobs,tasks,utils/helper,public} \
  tests/{unit,integration,fixtures} \
  infra/{kubernetes,terraform} \
  docker \
  .github/workflows \
  ci \
  logs \
  coverage \
  scripts && \
touch logs/.gitkeep coverage/.gitkeep src/public/.gitkeep \
  src/config/index.js src/config/logger.js \
  .env.example .eslintrc.js && \
echo "✅ Production folder structure ready"
```

---

## Summary Table

| Folder | Owner | Deploy | Test | Frequency |
|--------|-------|--------|------|-----------|
| `src/` | Backend team | Yes (image) | Unit + Integration | Every PR |
| `tests/` | Backend team | No | N/A | Every commit |
| `infra/` | DevOps/Platform | Yes (apply) | N/A (review) | On change |
| `docker/` | DevOps/Backend | Yes (build) | Image scan | Per build |
| `.github/workflows/` | DevOps | Yes (execute) | N/A | Per event |
| `scripts/` | Any | No | Optional | Ad-hoc |

# DistInc API Gateway

A TypeScript API gateway for the DistInc personal finance platform, deployed as an Express-based Firebase Cloud Function to validate, authenticate, and route client requests across user, financial data, and notification microservices.

## Links

- [Live application](https://www.distinc.co.uk)
- [Demo video](https://youtu.be/xbIUeWg9SuI)
- Production API: [`GET` proxy](https://us-central1-distinc-9ad9d.cloudfunctions.net/apiGateway/gatewayRequestGet) and [`POST` proxy](https://us-central1-distinc-9ad9d.cloudfunctions.net/apiGateway/gatewayRequestPost)
- [React PWA](https://github.com/SaoodCS/DistInc-PWA-React-TypeScript-Front-End)
- [Data microservice](https://github.com/SaoodCS/Distinc-Data-Microservice)
- [User microservice](https://github.com/SaoodCS/DistInc-User-Microservice)
- [Notification microservice](https://github.com/SaoodCS/Distinc-Notification-Microservice)

## Overview

DistInc helps users track income and expenses, monitor savings, current, and credit accounts, set account targets, and calculate how monthly income should be distributed. This repository provides the system's public backend entry point: the frontend sends a microservice identifier with each request, and the gateway resolves the corresponding environment-specific service URL before forwarding the request.

## Tech Stack

| Area | Technology | Purpose |
|---|---|---|
| Runtime | Node.js 20, TypeScript 5.4 | Strictly typed server-side implementation |
| API | Express, Firebase Cloud Functions | HTTP middleware pipeline and serverless deployment |
| Authentication | Firebase Admin SDK | Firebase ID-token verification support |
| Networking | `node-fetch` | Downstream microservice requests |
| Testing | Jest, `ts-jest` | TypeScript unit tests |
| Quality | ESLint, Prettier, TypeScript | Static analysis, formatting, and type checking |
| Delivery | GitHub Actions, Firebase CLI | Branch-based CI/CD to development and production projects |

## Key Features

- Provides one serverless entry point for DistInc's user, financial data, calculation, and notification operations.
- Routes requests through an environment-driven registry instead of hard-coding downstream service URLs.
- Supports both GET and POST proxy flows while preserving downstream error status codes and JSON responses.
- Restricts browser access through an explicit CORS allowlist for local, development, and production clients.
- Validates JSON content type and the required `microservice` routing header outside the local emulator.
- Adds a shared API key to downstream requests and forwards authorization headers for protected service entries.
- Supports local or deployed microservices against either the DistInc development or production Firebase project.
- Runs type checking, linting, tests, and Firebase deployment through a branch-aware GitHub Actions workflow.

## Architecture

```text
React PWA
   |
   v
Firebase HTTPS Function: apiGateway
   |
   +-- CORS allowlist
   +-- header and route validation
   +-- optional Firebase token verification
   |
   v
Environment-backed microservice registry
   |
   +-- User microservice
   +-- Data microservice
   +-- Notification microservice
```

The application is intentionally small and layered:

```text
functions/src/
├── endpoints/    # GET and POST proxy handlers
├── middleware/   # CORS, header validation, and authentication
├── utils/        # Service registry, response codes, and Firebase utilities
├── helpers/      # Shared lookup logic and environment scripts
└── index.ts      # Express composition and Cloud Function export
```

The `microservice` request header is matched against `Microservices.ts`. Each registry entry contains a service name, an environment-supplied URL, and a security level. The selected handler then adds the internal API key, conditionally forwards the Firebase authorization header, calls the downstream service, and returns its JSON response.

## API Overview

| Method | Production route | Purpose |
|---|---|---|
| `GET` | `/apiGateway/gatewayRequestGet` | Proxies read operations to the selected microservice |
| `POST` | `/apiGateway/gatewayRequestPost` | Proxies JSON request bodies to the selected microservice |

Deployed requests use:

| Input | Requirement |
|---|---|
| `Content-Type` | Must be `application/json` |
| `microservice` | Must match a registered service name |
| `Authorization` | Forwarded as a bearer token for protected service entries |
| Request body | Required by the POST proxy |

Registered operations cover user registration, deletion and reset; savings, current and credit accounts; income; expenses; calculations; and notification settings. The gateway accepts and returns JSON. Downstream non-success status codes are passed back to the client.

## Getting Started

### Prerequisites

- Node.js 20
- npm
- Firebase CLI 13.7.2 for emulation or deployment
- Access to the relevant Firebase project and downstream microservice URLs

### Installation

```bash
git clone https://github.com/SaoodCS/DistInc-API-Gateway.git
cd DistInc-API-Gateway
npm install
```

The root install script installs the dependencies in `functions/`, where the Cloud Function package is located.

### Environment

Environment files are intentionally not committed, and the repository does not currently include a `.env.example`. For development against local microservices, create `functions/.env.localdev`. The environment-switching script copies the selected file to `functions/.env` before starting or deploying.

```dotenv
NODE_ENV=development
API_KEY=replace-with-shared-microservice-key
TEST_SERVICE_ENDPOINT=http://localhost:PORT/test
REGISTER_USER_SERVICE_ENDPOINT=http://localhost:PORT/registerUser
DELETE_USER_SERVICE_ENDPOINT=http://localhost:PORT/deleteUser
RESET_USER_SERVICE_ENDPOINT=http://localhost:PORT/resetUser

SET_SAVINGSACCOUNT_SERVICE_ENDPOINT=http://localhost:PORT/setSavingsAccount
GET_SAVINGSACCOUNT_SERVICE_ENDPOINT=http://localhost:PORT/getSavingsAccount
DELETE_SAVINGSACCOUNT_SERVICE_ENDPOINT=http://localhost:PORT/deleteSavingsAccount
SET_CURRENTACCOUNT_SERVICE_ENDPOINT=http://localhost:PORT/setCurrentAccount
GET_CURRENTACCOUNT_SERVICE_ENDPOINT=http://localhost:PORT/getCurrentAccount
DELETE_CURRENTACCOUNT_SERVICE_ENDPOINT=http://localhost:PORT/deleteCurrentAccount
SET_CREDITACCOUNT_SERVICE_ENDPOINT=http://localhost:PORT/setCreditAccount
GET_CREDITACCOUNT_SERVICE_ENDPOINT=http://localhost:PORT/getCreditAccount
DELETE_CREDITACCOUNT_SERVICE_ENDPOINT=http://localhost:PORT/deleteCreditAccount

SET_INCOME_SERVICE_ENDPOINT=http://localhost:PORT/setIncome
GET_INCOME_SERVICE_ENDPOINT=http://localhost:PORT/getIncomes
DELETE_INCOME_SERVICE_ENDPOINT=http://localhost:PORT/deleteIncome
SET_EXPENSE_SERVICE_ENDPOINT=http://localhost:PORT/setExpense
GET_EXPENSE_SERVICE_ENDPOINT=http://localhost:PORT/getExpenses
DELETE_EXPENSE_SERVICE_ENDPOINT=http://localhost:PORT/deleteExpense
SET_CALCULATIONS_SERVICE_ENDPOINT=http://localhost:PORT/setCalculations
GET_CALCULATIONS_SERVICE_ENDPOINT=http://localhost:PORT/getCalculations
DELETE_CALCULATIONS_SERVICE_ENDPOINT=http://localhost:PORT/deleteCalculations

SET_NOTIF_SETTINGS_SERVICE_ENDPOINT=http://localhost:PORT/setNotifSettings
GET_NOTIF_SETTINGS_SERVICE_ENDPOINT=http://localhost:PORT/getNotifSettings
DELETE_NOTIF_SETTINGS_SERVICE_ENDPOINT=http://localhost:PORT/deleteNotifSettings
```

Start the development Firebase project with local downstream endpoints:

```bash
npm run serve-dev-to-local
```

The equivalent `prod` and `to-deployed` scripts select the other supported Firebase project and downstream environment combinations.

## Available Scripts

| Command | Description |
|---|---|
| `npm run build` | Removes generated output and compiles TypeScript |
| `npm run serve-dev-to-local` | Emulates the development gateway against local microservices |
| `npm run serve-prod-to-local` | Emulates the production gateway against local microservices |
| `npm run serve-dev-to-deployed` | Emulates the development gateway against deployed microservices |
| `npm run serve-prod-to-deployed` | Emulates the production gateway against deployed microservices |
| `npm run test` | Runs the Jest test suite |
| `npm run test-watch` | Runs Jest in watch mode |
| `npm run lint-ts` | Runs ESLint and TypeScript checks concurrently |
| `npm run lint-fix` | Applies supported ESLint fixes |
| `npm run prettify` | Formats TypeScript source files with Prettier |
| `npm run deploy-dev` | Builds and deploys `apiGateway` to `distinc-dev` |
| `npm run deploy-prod` | Builds and deploys `apiGateway` to `distinc-9ad9d` |

## Testing and Quality

- TypeScript is configured with `strict: true`.
- ESLint includes TypeScript, import, unused-code, Prettier, and security rules.
- Jest currently tests the generic service-registry lookup helper, including missing and duplicate matches.
- GitHub Actions runs type checking, linting, and tests before deployment.

## Deployment

The gateway is deployed as the `apiGateway` Firebase HTTPS function. Pushes to `dev` deploy to the `distinc-dev` project; pushes to `prod` deploy to `distinc-9ad9d`. GitHub Actions installs Node.js 20.12.2 and Firebase CLI 13.7.2, injects environment and service-account secrets, runs the quality checks, and deploys only after they pass.

## Engineering Decisions

- A central service registry keeps routing changes explicit and allows the same build to target local, development, or production endpoints through environment configuration.
- Middleware centralizes cross-origin checks and request validation so proxy handlers remain focused on routing and response handling.
- Downstream services receive an internal API key, while user authorization is forwarded separately, preserving service-to-service and user-level trust boundaries.
- Separate Firebase projects and branch-triggered deployments reduce the risk of development changes reaching production unintentionally.
- Downstream status codes and response bodies are retained so clients receive the originating service's failure context.

## Known Limitations and Roadmap

- Add a sanitized `.env.example` to make setup safer and faster.
- Add integration tests for middleware, GET/POST proxy behavior, authentication, and downstream failures; current automated coverage is limited to one helper.
- Add request timeouts, correlation IDs, and rate limiting for stronger operational visibility and resilience.

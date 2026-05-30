# GitAnalyzer

GitAnalyzer is a production-oriented GitHub profile intelligence platform built with a Next.js frontend, an Express + MySQL backend, and the GitHub REST API. It analyzes public GitHub profiles, stores full snapshots in MySQL, and exposes a documented API for analysis, refresh, listing, detail views, and deletion.

## Live Demo

> No public deployment is currently configured in this repository.

If you deploy it, add the frontend and API URLs here.

## Features

| Feature | Status | Details |
| --- | --- | --- |
| GitHub profile analysis | Done | Analyze a username and generate a full intelligence report. |
| MySQL persistence | Done | Store profiles, repos, languages, and activity snapshots. |
| Profile list and detail views | Done | Browse stored analyses, open details, and delete records. |
| Developer scoring | Done | Generate level-based scorecards from repository and activity data. |
| API documentation | Done | Swagger/OpenAPI docs are available from the backend. |
| Real GitHub REST API integration | Done | Uses live GitHub profile, repository, and event data. |
| Error handling and validation | Done | App-router error boundaries and backend validation are in place. |
| Deployment support | Ready | Supports separate hosting or Docker Compose deployment. |

## Tech Stack

- Frontend: Next.js 15 App Router
- Backend: Express.js, TypeScript, Zod, Swagger/OpenAPI
- Database: MySQL 8
- UI: Tailwind CSS, Recharts, Lucide React, Sonner
- State: Zustand
- API source: GitHub REST API

## Architecture

- Frontend app lives in `src/`
- Backend API lives in `backend/`
- Database schema and seed scripts live in `backend/database/`
- Root scripts orchestrate frontend and backend development separately

The system is built as a clean full-stack split:

- Next.js handles the user interface and API consumption.
- Express handles profile analysis, persistence, and API responses.
- MySQL stores normalized profile data and related child records.

## Project Structure

```text
GitAnalyzer/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── error.tsx
│   │   ├── global-error.tsx
│   │   ├── analyzed-profiles/
│   │   └── api-documentation/
│   ├── components/
│   ├── styles/
│   └── app/stores/
├── backend/
│   ├── src/
│   ├── database/
│   └── .env
├── public/
└── package.json
```

## Key Screens

- Home page: analyze a GitHub username and generate a report.
- Stored profiles page: search, sort, and filter saved analyses.
- Profile detail page: view score, repo stats, language breakdown, and activity insights.
- API docs page: open backend Swagger UI and health check links.

## Local Setup

### Prerequisites

- Node.js 18+
- MySQL 8+
- A GitHub account or public username for testing

### 1. Install Dependencies

```bash
npm install
cd backend
npm install
```

### 2. Configure Environment

Create `backend/.env` and set:

```env
PORT=4000
NODE_ENV=development
GITHUB_TOKEN=
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=gitanalyzer
CORS_ORIGIN=http://localhost:3000
```

Create a root `.env.local` for the frontend if needed:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### 3. Create the Database

Run `backend/database/schema.sql` in MySQL to create the tables.

### 4. Start the Apps

```bash
npm run dev
npm run dev:api
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- Swagger UI: `http://localhost:4000/docs`

## Deployment

This repository supports two deployment styles.

### Option 1: Split Deployment

- Deploy the Next.js frontend to Vercel, Netlify, or another Node host.
- Deploy the Express API to Render, Railway, Fly.io, or a VPS.
- Use a managed MySQL instance or your own MySQL server.

Recommended production split:

- Frontend: Vercel
- Backend API: Render or Railway
- Database: Managed MySQL such as PlanetScale, Railway MySQL, or a cloud MySQL instance

Set these production environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
CORS_ORIGIN=https://your-frontend-domain.com
MYSQL_HOST=...
MYSQL_PORT=3306
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DATABASE=...
GITHUB_TOKEN=...
```

Build and start commands:

```bash
npm run build
npm run start
```

Backend:

```bash
npm run build:api
npm run start:api
```

Deployment checklist:

1. Provision a production MySQL database and import `backend/database/schema.sql`.
2. Deploy the backend first and confirm `/api/v1/health` and `/docs` work.
3. Set `CORS_ORIGIN` to your frontend domain in the backend environment.
4. Deploy the frontend and set `NEXT_PUBLIC_API_BASE_URL` to the backend URL.
5. Open the site and verify profile analysis, list loading, detail pages, and delete actions.

### Option 2: Docker Compose

If Docker is available, run the full stack with:

```bash
docker compose up --build -d
```

## Submission Note

If you are submitting this as an assignment, a strong summary is:

> GitAnalyzer is a production-ready full-stack application with a live GitHub REST API integration, persistent MySQL storage, Swagger documentation, error handling, and deployment support. The project is validated with frontend and backend builds and is ready for production hosting.

## API Endpoints

- `POST /api/v1/profiles/analyze` - analyze and persist a GitHub profile
- `GET /api/v1/profiles` - list stored analyses with pagination, sorting, and filters
- `GET /api/v1/profiles/:username` - fetch one stored profile
- `PATCH /api/v1/profiles/:username/refresh` - refresh the analysis from GitHub
- `DELETE /api/v1/profiles/:username` - delete the stored analysis
- `GET /api/v1/health` - backend health check
- `GET /docs` - Swagger UI

## Validation

The following checks were completed during development:

- Frontend build passes with `npm run build`
- Backend build passes with `npm run build:api`
- Profile analysis works against the live GitHub REST API
- Stored profile list and detail pages load from MySQL
- App-router error boundaries are present
- Duplicate React key warning on the docs page was fixed

## What It Does Well

- Clean separation between frontend, backend, and database layers
- Real persistence instead of mock data
- Clear API contract with Swagger docs
- Responsive dashboard and profile views
- Ready for deployment with either split hosting or Docker

## Notes

- A GitHub token is optional, but recommended to reduce rate-limit issues.
- If the frontend cannot reach the backend, check `NEXT_PUBLIC_API_BASE_URL` and `CORS_ORIGIN`.
- If MySQL parsing issues appear, verify the schema is loaded and the backend env file is correct.
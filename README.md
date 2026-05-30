# GitAnalyzer

<div align="center">

### GitHub Profile Intelligence Platform

Analyze GitHub profiles, generate developer intelligence reports, track repository insights, evaluate coding activity, and store analysis snapshots with a production-ready full-stack architecture.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6)
![Express](https://img.shields.io/badge/Express.js-000000)
![MySQL](https://img.shields.io/badge/MySQL-4479A1)
![Docker](https://img.shields.io/badge/Docker-2496ED)
![GitHub API](https://img.shields.io/badge/GitHub_API-v3-181717)

</div>

---

## Live Demo

> Frontend: `https://git-analyzer-u2o4.vercel.app`
>
> API: `https://gitanalyzer-1.onrender.com` or your deployed Express API URL

---

## Overview

GitAnalyzer is a full-stack GitHub intelligence platform that transforms a GitHub username into a detailed developer report.

The platform fetches live GitHub data, calculates developer metrics, analyzes repositories, tracks language usage, evaluates activity patterns, generates developer scores, and persists everything inside MySQL for future retrieval.

---

## Key Features

### GitHub Profile Analysis

- Analyze any public GitHub profile
- Fetch repositories, followers, following, and activity
- Calculate developer intelligence metrics

### Developer Insights

- Developer Score Calculation
- Developer Level Classification
- Language Distribution Analysis
- Repository Performance Metrics
- Activity Insights

### Persistent Storage

- MySQL-backed storage
- Historical profile snapshots
- Profile refresh support
- Profile deletion support

### API Documentation

- Swagger/OpenAPI integration
- Interactive API testing
- Health monitoring endpoint

### Production Ready

- Dockerized backend
- Separate frontend/backend deployment
- Environment-based configuration
- Error handling & validation

---

## System Architecture

```text
┌────────────────────┐
│     Next.js UI     │
└─────────┬──────────┘
		  │
		  ▼
┌────────────────────┐
│   Express API      │
└─────────┬──────────┘
		  │
		  ▼
┌────────────────────┐
│      MySQL DB      │
└─────────┬──────────┘
		  │
		  ▼
┌────────────────────┐
│  GitHub REST API   │
└────────────────────┘
```

---

## Screenshots

Add screenshots of:

- Home page profile analyzer
- Stored profiles page
- Profile details page
- Swagger API docs

---

## Tech Stack

- Frontend: Next.js 16 App Router
- Backend: Express.js, TypeScript, Zod, Swagger/OpenAPI
- Database: MySQL 8
- UI: Tailwind CSS, Recharts, Lucide React, Sonner
- State: Zustand
- API source: GitHub REST API

---

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
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── domain/
│   │   ├── errors/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── database/
│   │   └── schema.sql
│   └── .env
├── public/
│   ├── assets/
│   └── favicon.ico
├── package.json
└── README.md
```

---

## Database Schema

The database schema is located in:

```text
backend/database/schema.sql
```

This file contains the MySQL schema/export required by the assignment, including:

- `analyzed_profiles`
- `analyzed_profile_repositories`
- `analyzed_profile_languages`

The schema defines:

- table structures
- primary keys
- foreign keys
- unique constraints
- indexes

If you need the schema export for submission, use `backend/database/schema.sql`.

---

## Assignment Requirements Covered

- Fetch public profile data from GitHub using username
- Store useful insights such as repository count, followers count, stars, activity, and language breakdown
- Store analysis results in MySQL
- API to fetch all stored analyzed profiles
- API to fetch a single stored profile
- Additional improvements like Swagger docs, refresh/delete actions, and production deployment support

---

## Why This Project Stands Out

- It goes beyond the minimum backend CRUD requirement by adding real developer intelligence scoring.
- It stores full analysis snapshots in MySQL instead of only raw GitHub response data.
- It supports a production split between frontend and backend deployments.
- It includes Swagger documentation, validation, error boundaries, and deployment-ready configuration.
- It is already validated with successful local builds and real GitHub API calls.

---

## How It Works

1. Enter a GitHub username in the frontend.
2. The Next.js app sends the request to the Express API.
3. The backend fetches live profile, repository, and activity data from the GitHub REST API.
4. The service calculates insights such as score, level, language usage, and repo metrics.
5. The analysis is saved in MySQL as a stored snapshot.
6. The frontend can then list, refresh, view, or delete stored profiles.

---

## Future Improvements

- Add Playwright end-to-end tests for the full analysis flow.
- Add a Postman collection for the public API.
- Add deployment screenshots and a live demo banner.
- Add background jobs for periodic profile refreshes.
- Add GitHub rate-limit monitoring and alerting.

---

## API Endpoints

- `POST /api/v1/profiles/analyze` - analyze and persist a GitHub profile
- `GET /api/v1/profiles` - list stored analyses with pagination, sorting, and filters
- `GET /api/v1/profiles/:username` - fetch one stored profile
- `PATCH /api/v1/profiles/:username/refresh` - refresh the analysis from GitHub
- `DELETE /api/v1/profiles/:username` - delete the stored analysis
- `GET /api/v1/health` - backend health check
- `GET /docs` - Swagger UI

---

## Local Setup

### Prerequisites

- Node.js 18+
- MySQL 8+
- A GitHub account or public username for testing

### Install Dependencies

```bash
npm install
cd backend
npm install
```

### Configure Environment

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

### Create the Database

Run `backend/database/schema.sql` in MySQL to create the tables.

### Start the Apps

```bash
npm run dev
npm run dev:api
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- Swagger UI: `http://localhost:4000/docs`

---

## Deployment

### Split Deployment

- Deploy the Next.js frontend to Vercel, Netlify, or another Node host.
- Deploy the Express API to Render, Railway, Fly.io, or a VPS.
- Use a managed MySQL instance or your own MySQL server.

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

### Docker Compose

If Docker is available, run the full stack with:

```bash
docker compose up --build -d
```

---

## Validation

The following checks were completed during development:

- Frontend build passes with `npm run build`
- Backend build passes with `npm run build:api`
- Profile analysis works against the live GitHub REST API
- Stored profile list and detail pages load from MySQL
- App-router error boundaries are present
- Duplicate React key warning on the docs page was fixed

---

## Submission Requirements

Use this for the assignment submission:

- GitHub repository link
- Live deployed API URL
- README file with setup instructions
- Database schema/export: `backend/database/schema.sql`
- Postman collection: optional

---

## Notes

- A GitHub token is optional, but recommended to reduce rate-limit issues.
- If the frontend cannot reach the backend, check `NEXT_PUBLIC_API_BASE_URL` and `CORS_ORIGIN`.
- If MySQL parsing issues appear, verify the schema is loaded and the backend env file is correct.
## How It Works

1. Enter a GitHub username in the frontend.
2. The Next.js app sends the request to the Express API.
3. The backend fetches live profile, repository, and activity data from the GitHub REST API.
4. The service calculates insights such as score, level, language usage, and repo metrics.
5. The analysis is saved in MySQL as a stored snapshot.
6. The frontend can then list, refresh, view, or delete stored profiles.

---

## Future Improvements

- Add Playwright end-to-end tests for the full analysis flow.
- Add a Postman collection for the public API.
- Add deployment screenshots and a live demo banner.
- Add background jobs for periodic profile refreshes.
- Add GitHub rate-limit monitoring and alerting.

---

## API Endpoints

- `POST /api/v1/profiles/analyze` - analyze and persist a GitHub profile
- `GET /api/v1/profiles` - list stored analyses with pagination, sorting, and filters
- `GET /api/v1/profiles/:username` - fetch one stored profile
- `PATCH /api/v1/profiles/:username/refresh` - refresh the analysis from GitHub
- `DELETE /api/v1/profiles/:username` - delete the stored analysis
- `GET /api/v1/health` - backend health check
- `GET /docs` - Swagger UI

---

## Local Setup

### Prerequisites

- Node.js 18+
- MySQL 8+
- A GitHub account or public username for testing

### Install Dependencies

```bash
npm install
cd backend
npm install
```

### Configure Environment

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

### Create the Database

Run `backend/database/schema.sql` in MySQL to create the tables.

### Start the Apps

```bash
npm run dev
npm run dev:api
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- Swagger UI: `http://localhost:4000/docs`

---

## Deployment

### Split Deployment

- Deploy the Next.js frontend to Vercel, Netlify, or another Node host.
- Deploy the Express API to Render, Railway, Fly.io, or a VPS.
- Use a managed MySQL instance or your own MySQL server.

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

### Docker Compose

If Docker is available, run the full stack with:

```bash
docker compose up --build -d
```

---

## Validation

The following checks were completed during development:

- Frontend build passes with `npm run build`
- Backend build passes with `npm run build:api`
- Profile analysis works against the live GitHub REST API
- Stored profile list and detail pages load from MySQL
- App-router error boundaries are present
- Duplicate React key warning on the docs page was fixed

---

## Submission Requirements

Use this for the assignment submission:

- GitHub repository link
- Live deployed API URL
- README file with setup instructions
- Database schema/export: `backend/database/schema.sql`
- Postman collection: optional

---

## Notes

- A GitHub token is optional, but recommended to reduce rate-limit issues.
- If the frontend cannot reach the backend, check `NEXT_PUBLIC_API_BASE_URL` and `CORS_ORIGIN`.
- If MySQL parsing issues appear, verify the schema is loaded and the backend env file is correct.


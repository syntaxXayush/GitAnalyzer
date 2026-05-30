# 🚀 GitAnalyzer

<div align="center">

### GitHub Profile Intelligence Platform

Analyze GitHub profiles, generate developer intelligence reports, track repository insights, evaluate coding activity, and store analysis snapshots with a production-ready full-stack architecture.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6)
![Express](https://img.shields.io/badge/Express.js-000000)
![MySQL](https://img.shields.io/badge/MySQL-4479A1)
![Docker](https://img.shields.io/badge/Docker-2496ED)
![GitHub API](https://img.shields.io/badge/GitHub_API-v3-181717)

</div>

---

## 🌟 Overview

GitAnalyzer is a full-stack GitHub intelligence platform that transforms a GitHub username into a detailed developer report.

The platform fetches live GitHub data, calculates developer metrics, analyzes repositories, tracks language usage, evaluates activity patterns, generates developer scores, and persists everything inside MySQL for future retrieval.

---

## ✨ Key Features

### 🔍 GitHub Profile Analysis

- Analyze any public GitHub profile
- Fetch repositories, followers, following, and activity
- Calculate developer intelligence metrics

### 📊 Developer Insights

- Developer Score Calculation
- Developer Level Classification
- Language Distribution Analysis
- Repository Performance Metrics
- Activity Insights

### 🗄️ Persistent Storage

- MySQL-backed storage
- Historical profile snapshots
- Profile refresh support
- Profile deletion support

### 📖 API Documentation

- Swagger/OpenAPI integration
- Interactive API testing
- Health monitoring endpoint

### 🐳 Production Ready

- Dockerized backend
- Separate frontend/backend deployment
- Environment-based configuration
- Error handling & validation

---

## 🏗️ System Architecture

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

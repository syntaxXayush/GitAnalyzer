import dotenv from 'dotenv';

dotenv.config();

function readRequired(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }

  return parsed;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: readNumber('PORT', 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  apiPrefix: process.env.API_PREFIX ?? '/api/v1',
  analysisCacheTtlMinutes: readNumber('ANALYSIS_CACHE_TTL_MINUTES', 1440),
  github: {
    apiBaseUrl: process.env.GITHUB_API_BASE_URL ?? 'https://api.github.com',
    token: process.env.GITHUB_TOKEN ?? '',
  },
  mysql: {
    host: readRequired('MYSQL_HOST', '127.0.0.1'),
    port: readNumber('MYSQL_PORT', 3306),
    user: readRequired('MYSQL_USER', 'root'),
    password: process.env.MYSQL_PASSWORD ?? '',
    database: readRequired('MYSQL_DATABASE', 'gitanalyzer'),
    connectionLimit: readNumber('MYSQL_CONNECTION_LIMIT', 10),
  },
};
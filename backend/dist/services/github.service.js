"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubService = void 0;
const env_1 = require("../config/env");
const app_error_1 = require("../errors/app-error");
class GitHubService {
    baseUrl;
    token;
    constructor(baseUrl = env_1.env.github.apiBaseUrl, token = env_1.env.github.token) {
        this.baseUrl = baseUrl;
        this.token = token;
    }
    async getUser(username) {
        return this.request(`/users/${encodeURIComponent(username)}`);
    }
    async getRepositories(username) {
        const repositories = [];
        for (let page = 1; page <= 10; page += 1) {
            const batch = await this.request(`/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated&direction=desc&type=owner`);
            repositories.push(...batch);
            if (batch.length < 100) {
                break;
            }
        }
        return repositories;
    }
    async getPublicEvents(username) {
        const events = [];
        for (let page = 1; page <= 3; page += 1) {
            const batch = await this.request(`/users/${encodeURIComponent(username)}/events/public?per_page=100&page=${page}`);
            events.push(...batch);
            if (batch.length < 100) {
                break;
            }
        }
        return events;
    }
    async request(path, options = {}) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: options.method ?? 'GET',
            headers: {
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': 'GitAnalyzer/1.0.0',
                ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
            },
        });
        if (response.status === 404) {
            throw new app_error_1.NotFoundError('GitHub user not found');
        }
        if (response.status === 403 || response.status === 429) {
            const reset = response.headers.get('x-ratelimit-reset');
            throw new app_error_1.ExternalServiceError('GitHub API rate limit exceeded', 429, {
                reset,
                requestId: response.headers.get('x-github-request-id'),
            });
        }
        if (!response.ok) {
            const payload = await this.safeJson(response);
            throw new app_error_1.ExternalServiceError('GitHub API request failed', response.status, payload);
        }
        return (await response.json());
    }
    async safeJson(response) {
        try {
            return await response.json();
        }
        catch {
            return null;
        }
    }
}
exports.GitHubService = GitHubService;

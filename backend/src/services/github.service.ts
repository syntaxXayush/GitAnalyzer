import { env } from '../config/env';
import { ExternalServiceError, NotFoundError } from '../errors/app-error';
import { GitHubEvent, GitHubRepository, GitHubUser } from '../domain/profile';

type GitHubRequestOptions = {
  method?: 'GET';
};

export class GitHubService {
  constructor(private readonly baseUrl = env.github.apiBaseUrl, private readonly token = env.github.token) {}

  async getUser(username: string): Promise<GitHubUser> {
    return this.request<GitHubUser>(`/users/${encodeURIComponent(username)}`);
  }

  async getRepositories(username: string): Promise<GitHubRepository[]> {
    const repositories: GitHubRepository[] = [];

    for (let page = 1; page <= 10; page += 1) {
      const batch = await this.request<GitHubRepository[]>(
        `/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated&direction=desc&type=owner`,
      );

      repositories.push(...batch);

      if (batch.length < 100) {
        break;
      }
    }

    return repositories;
  }

  async getPublicEvents(username: string): Promise<GitHubEvent[]> {
    const events: GitHubEvent[] = [];

    for (let page = 1; page <= 3; page += 1) {
      const batch = await this.request<GitHubEvent[]>(`/users/${encodeURIComponent(username)}/events/public?per_page=100&page=${page}`);
      events.push(...batch);

      if (batch.length < 100) {
        break;
      }
    }

    return events;
  }

  private async request<T>(path: string, options: GitHubRequestOptions = {}): Promise<T> {
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
      throw new NotFoundError('GitHub user not found');
    }

    if (response.status === 403 || response.status === 429) {
      const reset = response.headers.get('x-ratelimit-reset');
      throw new ExternalServiceError('GitHub API rate limit exceeded', 429, {
        reset,
        requestId: response.headers.get('x-github-request-id'),
      });
    }

    if (!response.ok) {
      const payload = await this.safeJson(response);
      throw new ExternalServiceError('GitHub API request failed', response.status, payload);
    }

    return (await response.json()) as T;
  }

  private async safeJson(response: Response): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
}
import { ProfileRepository } from '../repositories/profile.repository';
import { AnalysisResult, AnalyzedProfile, GitHubEvent, GitHubRepository, GitHubUser, StoredAnalysis } from '../domain/profile';
import { normalizeUsername } from '../utils/normalize-username';
import { buildDeveloperScore } from '../utils/score';
import { monthLabels, yearsBetween } from '../utils/dates';
import { GitHubService } from './github.service';
import { ValidationError } from '../errors/app-error';

export class ProfileAnalysisService {
  constructor(
    private readonly repository: ProfileRepository,
    private readonly githubService: GitHubService,
  ) {}

  async analyze(username: string, forceRefresh = false): Promise<AnalysisResult> {
    const normalized = normalizeUsername(username);
    if (!normalized) {
      throw new ValidationError('GitHub username is required');
    }

    if (!forceRefresh) {
      const cached = await this.repository.findByUsername(normalized);
      if (cached) {
        return { profile: this.stripInternalFields(cached), cached: true, refreshed: false };
      }
    }

    const [user, repositories, events] = await Promise.all([
      this.githubService.getUser(normalized),
      this.githubService.getRepositories(normalized),
      this.githubService.getPublicEvents(normalized),
    ]);

    const profile = this.buildAnalysis(user, repositories, events);
    await this.repository.save(profile);

    return { profile: this.stripInternalFields(profile), cached: false, refreshed: forceRefresh };
  }

  async findByUsername(username: string): Promise<AnalyzedProfile | null> {
    const profile = await this.repository.findByUsername(normalizeUsername(username));
    return profile ? this.stripInternalFields(profile) : null;
  }

  async list(filters: Parameters<ProfileRepository['list']>[0]) {
    return this.repository.list(filters);
  }

  async delete(username: string): Promise<boolean> {
    return this.repository.deleteByUsername(normalizeUsername(username));
  }

  private buildAnalysis(user: GitHubUser, repositories: GitHubRepository[], events: GitHubEvent[]): StoredAnalysis {
    const repoCount = repositories.length;
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
    const analyzedAt = new Date().toISOString();
    const accountCreatedAt = new Date(user.created_at).toISOString();
    const accountAgeYears = yearsBetween(new Date(user.created_at), new Date(analyzedAt));

    const languageMap = new Map<string, { count: number; stars: number }>();
    repositories.forEach((repo) => {
      const languageName = repo.language ?? 'Other';
      const current = languageMap.get(languageName) ?? { count: 0, stars: 0 };
      current.count += 1;
      current.stars += repo.stargazers_count;
      languageMap.set(languageName, current);
    });

    const languages = Array.from(languageMap.entries())
      .map(([name, stats]) => ({
        id: `language-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name,
        count: stats.count,
        pct: repoCount > 0 ? Number(((stats.count / repoCount) * 100).toFixed(1)) : 0,
      }))
      .sort((left, right) => right.count - left.count || right.pct - left.pct || left.name.localeCompare(right.name));

    const mostStarredRepo = repositories.reduce<AnalyzedProfile['mostStarredRepo'] | null>((best, repo) => {
      if (!best || repo.stargazers_count > best.stars) {
        return {
          id: String(repo.id),
          name: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language ?? 'Other',
          pushedAt: repo.pushed_at ?? repo.updated_at,
        };
      }

      return best;
    }, null) ?? {
      id: 'none',
      name: 'No repositories',
      stars: 0,
      forks: 0,
      language: 'Other',
      pushedAt: analyzedAt,
    };

    const monthlyBuckets = monthLabels(12);
    const monthMap = new Map(monthlyBuckets.map((bucket) => [bucket.key, { commits: 0, prs: 0 }]));
    let commits = 0;
    let prs = 0;
    let issues = 0;
    let pushes = 0;
    let lastActivityAt: string | null = null;

    events.forEach((event) => {
      const monthKey = event.created_at.slice(0, 7);
      const monthBucket = monthMap.get(monthKey);
      if (monthBucket) {
        if (event.type === 'PushEvent') {
          const pushedCommits = typeof event.payload?.size === 'number' ? event.payload.size : 1;
          monthBucket.commits += pushedCommits;
          commits += pushedCommits;
          pushes += 1;
        }

        if (event.type === 'PullRequestEvent') {
          monthBucket.prs += 1;
          prs += 1;
        }

        if (event.type === 'IssuesEvent') {
          issues += 1;
        }
      }

      if (!lastActivityAt || event.created_at > lastActivityAt) {
        lastActivityAt = event.created_at;
      }
    });

    const activityData = monthlyBuckets.map((bucket, index) => ({
      id: `activity-${bucket.key}-${index}`,
      month: bucket.month,
      commits: monthMap.get(bucket.key)?.commits ?? 0,
      prs: monthMap.get(bucket.key)?.prs ?? 0,
    }));

    const activitySummary = {
      commits,
      prs,
      issues,
      pushes,
      eventsScanned: events.length,
      recentActivityScore: commits * 4 + prs * 10 + issues * 5 + pushes * 6,
      lastActivityAt,
    };

    const scoring = buildDeveloperScore({
      user,
      repositories,
      languages,
      activitySummary,
    });

    const topRepos = [...repositories]
      .sort((left, right) => right.stargazers_count - left.stargazers_count || right.forks_count - left.forks_count)
      .slice(0, 8)
      .map((repo) => ({
        id: String(repo.id),
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language ?? 'Other',
        pushedAt: repo.pushed_at ?? repo.updated_at,
      }));

    return {
      username: user.login,
      name: user.name ?? user.login,
      avatarUrl: user.avatar_url,
      bio: user.bio ?? '',
      location: user.location ?? '',
      company: user.company ?? '',
      blog: user.blog ?? '',
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars,
      totalForks,
      accountCreatedAt,
      accountAgeYears,
      score: scoring.score,
      level: scoring.level,
      topLanguage: languages[0]?.name ?? 'Unknown',
      avgStarsPerRepo: repoCount > 0 ? Number((totalStars / repoCount).toFixed(1)) : 0,
      mostStarredRepo,
      languages,
      topRepos,
      activityData,
      analyzedAt,
      insights: scoring.insights,
      activitySummary,
      githubId: user.id,
      githubProfileUrl: user.html_url,
      rawProfile: user,
      rawRepos: repositories,
      rawEvents: events,
    };
  }

  private stripInternalFields(profile: StoredAnalysis): AnalyzedProfile {
    return {
      username: profile.username,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      location: profile.location,
      company: profile.company,
      blog: profile.blog,
      publicRepos: profile.publicRepos,
      followers: profile.followers,
      following: profile.following,
      totalStars: profile.totalStars,
      totalForks: profile.totalForks,
      accountCreatedAt: profile.accountCreatedAt,
      accountAgeYears: profile.accountAgeYears,
      score: profile.score,
      level: profile.level,
      topLanguage: profile.topLanguage,
      avgStarsPerRepo: profile.avgStarsPerRepo,
      mostStarredRepo: profile.mostStarredRepo,
      languages: profile.languages,
      topRepos: profile.topRepos,
      activityData: profile.activityData,
      analyzedAt: profile.analyzedAt,
      insights: profile.insights,
      activitySummary: profile.activitySummary,
    };
  }
}
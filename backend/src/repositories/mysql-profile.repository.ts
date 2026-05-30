import { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { PagedProfiles, ProfileListFilters, ProfileListItem, StoredAnalysis } from '../domain/profile';
import { ProfileRepository } from './profile.repository';
import { toUtcDate } from '../utils/dates';

type ProfileRow = RowDataPacket & {
  id: number;
  username: string;
  github_id: number;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  github_profile_url: string;
  public_repos: number;
  followers: number;
  following: number;
  account_created_at: Date;
  account_age_years: number;
  total_stars: number;
  total_forks: number;
  most_starred_repo_name: string | null;
  most_starred_repo_stars: number;
  top_language: string | null;
  avg_stars_per_repo: number;
  score: number;
  developer_level: string;
  language_summary_json: string;
  activity_data_json: string;
  activity_summary_json: string;
  insights_json: string;
  raw_profile_json: string;
  raw_repos_json: string;
  raw_events_json: string;
  analyzed_at: Date;
  refreshed_at: Date;
};

type RepositoryRow = RowDataPacket & {
  github_repo_id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  watchers: number;
  size: number;
  pushed_at: Date | null;
  updated_at_github: Date | null;
  is_fork: number;
  is_archived: number;
  raw_repo_json: string;
};

type LanguageRow = RowDataPacket & {
  language_name: string;
  repo_count: number;
  stars: number;
  percentage: number;
};

export class MysqlProfileRepository implements ProfileRepository {
  constructor(private readonly pool: Pool) {}

  async findByUsername(username: string): Promise<StoredAnalysis | null> {
    const [rows] = await this.pool.query<ProfileRow[]>('SELECT * FROM analyzed_profiles WHERE username = ?', [username]);
    if (rows.length === 0) {
      return null;
    }

    const profileRow = rows[0];
    return this.mapStoredAnalysis(profileRow);
  }

  async list(filters: ProfileListFilters): Promise<PagedProfiles> {
    const where: string[] = [];
    const params: unknown[] = [];

    if (filters.q) {
      where.push('(username LIKE ? OR name LIKE ?)');
      params.push(`%${filters.q}%`, `%${filters.q}%`);
    }

    if (filters.level) {
      where.push('developer_level = ?');
      params.push(filters.level);
    }

    if (filters.topLanguage) {
      where.push('top_language = ?');
      params.push(filters.topLanguage);
    }

    if (typeof filters.minScore === 'number') {
      where.push('score >= ?');
      params.push(filters.minScore);
    }

    if (typeof filters.maxScore === 'number') {
      where.push('score <= ?');
      params.push(filters.maxScore);
    }

    if (typeof filters.minFollowers === 'number') {
      where.push('followers >= ?');
      params.push(filters.minFollowers);
    }

    if (typeof filters.maxFollowers === 'number') {
      where.push('followers <= ?');
      params.push(filters.maxFollowers);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
    const orderColumn = this.mapSortColumn(filters.sortBy);
    const orderDirection = filters.sortOrder.toUpperCase();
    const offset = (filters.page - 1) * filters.limit;

    const [countRows] = await this.pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM analyzed_profiles ${whereClause}`,
      params,
    );

    const total = Number(countRows[0]?.total ?? 0);

    const [rows] = await this.pool.query<RowDataPacket[]>(
      `
        SELECT
          username,
          name,
          avatar_url,
          public_repos,
          followers,
          following,
          total_stars,
          total_forks,
          score,
          developer_level,
          top_language,
          avg_stars_per_repo,
          most_starred_repo_name,
          most_starred_repo_stars,
          account_age_years,
          analyzed_at
        FROM analyzed_profiles
        ${whereClause}
        ORDER BY ${orderColumn} ${orderDirection}
        LIMIT ? OFFSET ?
      `,
      [...params, filters.limit, offset],
    );

    const items = rows.map((row) => ({
      username: row.username,
      name: row.name ?? row.username,
      avatarUrl: row.avatar_url,
      publicRepos: Number(row.public_repos),
      followers: Number(row.followers),
      following: Number(row.following),
      totalStars: Number(row.total_stars),
      totalForks: Number(row.total_forks),
      score: Number(row.score),
      level: row.developer_level,
      topLanguage: row.top_language ?? 'Unknown',
      avgStarsPerRepo: Number(row.avg_stars_per_repo),
      mostStarredRepoName: row.most_starred_repo_name ?? 'Unknown',
      mostStarredRepoStars: Number(row.most_starred_repo_stars),
      accountAgeYears: Number(row.account_age_years),
      analyzedAt: new Date(row.analyzed_at).toISOString(),
    }));

    return {
      items,
      meta: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / filters.limit)),
      },
    };
  }

  async save(profile: StoredAnalysis): Promise<void> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const profileValues = [
        profile.username,
        profile.githubId,
        profile.name,
        profile.avatarUrl,
        profile.bio,
        profile.location,
        profile.company,
        profile.blog,
        profile.githubProfileUrl,
        profile.publicRepos,
        profile.followers,
        profile.following,
        toUtcDate(profile.accountCreatedAt),
        profile.accountAgeYears,
        profile.totalStars,
        profile.totalForks,
        profile.mostStarredRepo.name,
        profile.mostStarredRepo.stars,
        profile.topLanguage,
        profile.avgStarsPerRepo,
        profile.score,
        profile.level,
        JSON.stringify(profile.languages),
        JSON.stringify(profile.activityData),
        JSON.stringify(profile.activitySummary),
        JSON.stringify(profile.insights),
        JSON.stringify(profile.rawProfile),
        JSON.stringify(profile.rawRepos),
        JSON.stringify(profile.rawEvents),
        toUtcDate(profile.analyzedAt),
        toUtcDate(profile.analyzedAt),
      ];

      const [profileResult] = await connection.query<ResultSetHeader>(
        `
          INSERT INTO analyzed_profiles (
            username, github_id, name, avatar_url, bio, location, company, blog,
            github_profile_url, public_repos, followers, following, account_created_at,
            account_age_years, total_stars, total_forks, most_starred_repo_name,
            most_starred_repo_stars, top_language, avg_stars_per_repo, score,
            developer_level, language_summary_json, activity_data_json, activity_summary_json, insights_json,
            raw_profile_json, raw_repos_json, raw_events_json, analyzed_at, refreshed_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            github_id = VALUES(github_id),
            name = VALUES(name),
            avatar_url = VALUES(avatar_url),
            bio = VALUES(bio),
            location = VALUES(location),
            company = VALUES(company),
            blog = VALUES(blog),
            github_profile_url = VALUES(github_profile_url),
            public_repos = VALUES(public_repos),
            followers = VALUES(followers),
            following = VALUES(following),
            account_created_at = VALUES(account_created_at),
            account_age_years = VALUES(account_age_years),
            total_stars = VALUES(total_stars),
            total_forks = VALUES(total_forks),
            most_starred_repo_name = VALUES(most_starred_repo_name),
            most_starred_repo_stars = VALUES(most_starred_repo_stars),
            top_language = VALUES(top_language),
            avg_stars_per_repo = VALUES(avg_stars_per_repo),
            score = VALUES(score),
            developer_level = VALUES(developer_level),
            language_summary_json = VALUES(language_summary_json),
            activity_data_json = VALUES(activity_data_json),
            activity_summary_json = VALUES(activity_summary_json),
            insights_json = VALUES(insights_json),
            raw_profile_json = VALUES(raw_profile_json),
            raw_repos_json = VALUES(raw_repos_json),
            raw_events_json = VALUES(raw_events_json),
            analyzed_at = VALUES(analyzed_at),
            refreshed_at = VALUES(refreshed_at)
        `,
        profileValues,
      );

      const profileId = Number(profileResult.insertId || (await this.findProfileIdByUsername(profile.username, connection)));

      await connection.query('DELETE FROM analyzed_profile_repositories WHERE profile_id = ?', [profileId]);
      await connection.query('DELETE FROM analyzed_profile_languages WHERE profile_id = ?', [profileId]);

      const repositoryRows = profile.rawRepos.map((repo) => [
        profileId,
        repo.id,
        repo.name,
        repo.full_name,
        repo.html_url,
        repo.description,
        repo.language,
        repo.stargazers_count,
        repo.forks_count,
        repo.watchers_count,
        repo.size,
        toUtcDate(repo.pushed_at),
        toUtcDate(repo.updated_at),
        repo.fork ? 1 : 0,
        repo.archived ? 1 : 0,
        JSON.stringify(repo),
      ]);

      if (repositoryRows.length > 0) {
        await connection.query(
          `
            INSERT INTO analyzed_profile_repositories (
              profile_id, github_repo_id, name, full_name, html_url, description, language,
              stars, forks, watchers, size, pushed_at, updated_at_github, is_fork, is_archived, raw_repo_json
            ) VALUES ?
          `,
          [repositoryRows],
        );
      }

      const languageRows = profile.languages.map((language) => [
        profileId,
        language.name,
        language.count,
        profile.rawRepos.filter((repo) => (repo.language ?? 'Other') === language.name).reduce((sum, repo) => sum + repo.stargazers_count, 0),
        language.pct,
      ]);

      if (languageRows.length > 0) {
        await connection.query(
          `
            INSERT INTO analyzed_profile_languages (
              profile_id, language_name, repo_count, stars, percentage
            ) VALUES ?
          `,
          [languageRows],
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteByUsername(username: string): Promise<boolean> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const [rows] = await connection.query<RowDataPacket[]>('SELECT id FROM analyzed_profiles WHERE username = ?', [username]);
      if (rows.length === 0) {
        await connection.rollback();
        return false;
      }

      const profileId = Number(rows[0].id);
      await connection.query('DELETE FROM analyzed_profiles WHERE id = ?', [profileId]);
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  private async findProfileIdByUsername(username: string, connection: PoolConnection): Promise<number> {
    const [rows] = await connection.query<RowDataPacket[]>('SELECT id FROM analyzed_profiles WHERE username = ?', [username]);
    if (rows.length === 0) {
      throw new Error(`Unable to resolve profile id for ${username}`);
    }

    return Number(rows[0].id);
  }

  private async mapStoredAnalysis(profileRow: ProfileRow): Promise<StoredAnalysis> {
    const [repoRows] = await this.pool.query<RepositoryRow[]>('SELECT * FROM analyzed_profile_repositories WHERE profile_id = ? ORDER BY stars DESC, github_repo_id DESC', [profileRow.id]);
    const [languageRows] = await this.pool.query<LanguageRow[]>('SELECT * FROM analyzed_profile_languages WHERE profile_id = ? ORDER BY stars DESC, repo_count DESC, language_name ASC', [profileRow.id]);

    const rawRepos = repoRows.map((repo) => ({
      id: repo.github_repo_id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stargazers_count: Number(repo.stars),
      forks_count: Number(repo.forks),
      watchers_count: Number(repo.watchers),
      size: Number(repo.size),
      pushed_at: repo.pushed_at ? new Date(repo.pushed_at).toISOString() : null,
      updated_at: repo.updated_at_github ? new Date(repo.updated_at_github).toISOString() : new Date().toISOString(),
      fork: Boolean(repo.is_fork),
      archived: Boolean(repo.is_archived),
    }));

    const profile: StoredAnalysis = {
      username: profileRow.username,
      name: profileRow.name ?? profileRow.username,
      avatarUrl: profileRow.avatar_url,
      bio: profileRow.bio ?? '',
      location: profileRow.location ?? '',
      company: profileRow.company ?? '',
      blog: profileRow.blog ?? '',
      publicRepos: Number(profileRow.public_repos),
      followers: Number(profileRow.followers),
      following: Number(profileRow.following),
      totalStars: Number(profileRow.total_stars),
      totalForks: Number(profileRow.total_forks),
      accountCreatedAt: new Date(profileRow.account_created_at).toISOString(),
      accountAgeYears: Number(profileRow.account_age_years),
      score: Number(profileRow.score),
      level: profileRow.developer_level,
      topLanguage: profileRow.top_language ?? 'Unknown',
      avgStarsPerRepo: Number(profileRow.avg_stars_per_repo),
      mostStarredRepo: {
        id: 'most-starred',
        name: profileRow.most_starred_repo_name ?? 'Unknown',
        stars: Number(profileRow.most_starred_repo_stars),
        forks: 0,
        language: profileRow.top_language ?? 'Unknown',
        pushedAt: new Date(profileRow.analyzed_at).toISOString(),
      },
      languages: languageRows.map((language) => ({
        id: `language-${language.language_name}`,
        name: language.language_name,
        count: Number(language.repo_count),
        pct: Number(language.percentage),
      })),
      topRepos: repoRows.slice(0, 8).map((repo) => ({
        id: String(repo.github_repo_id),
        name: repo.name,
        stars: Number(repo.stars),
        forks: Number(repo.forks),
        language: repo.language ?? 'Other',
        pushedAt: repo.pushed_at ? new Date(repo.pushed_at).toISOString() : new Date(profileRow.analyzed_at).toISOString(),
      })),
      activityData: this.parseJsonField(profileRow.activity_data_json, [] as StoredAnalysis['activityData']),
      analyzedAt: new Date(profileRow.analyzed_at).toISOString(),
      insights: this.parseJsonField(profileRow.insights_json, {} as StoredAnalysis['insights']),
      activitySummary: this.parseJsonField(profileRow.activity_summary_json, {} as StoredAnalysis['activitySummary']),
      githubId: Number(profileRow.github_id),
      githubProfileUrl: profileRow.github_profile_url,
      rawProfile: this.parseJsonField(profileRow.raw_profile_json, {} as StoredAnalysis['rawProfile']),
      rawRepos,
      rawEvents: this.parseJsonField(profileRow.raw_events_json, [] as StoredAnalysis['rawEvents']),
    };

    return profile;
  }

  private parseJsonField<T>(value: unknown, fallback: T): T {
    if (value == null) {
      return fallback;
    }

    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as T;
      } catch {
        return fallback;
      }
    }

    return value as T;
  }

  private mapSortColumn(sortBy: ProfileListFilters['sortBy']): string {
    const sortMap: Record<ProfileListFilters['sortBy'], string> = {
      analyzedAt: 'analyzed_at',
      score: 'score',
      followers: 'followers',
      publicRepos: 'public_repos',
      totalStars: 'total_stars',
      totalForks: 'total_forks',
      username: 'username',
      topLanguage: 'top_language',
      level: 'developer_level',
    };

    return sortMap[sortBy];
  }
}
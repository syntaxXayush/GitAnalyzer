export interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  size: number;
  pushed_at: string | null;
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo?: {
    id: number;
    name: string;
  };
  payload?: Record<string, unknown> & {
    size?: number;
  };
}

export interface LanguageInsight {
  id: string;
  name: string;
  count: number;
  pct: number;
}

export interface TopRepositoryInsight {
  id: string;
  name: string;
  stars: number;
  forks: number;
  language: string;
  pushedAt: string;
}

export interface ActivityInsight {
  id: string;
  month: string;
  commits: number;
  prs: number;
}

export interface ProfileInsights {
  summary: string;
  strengths: string[];
  opportunities: string[];
  activitySignal: string;
  riskFlags: string[];
}

export interface ActivitySummary {
  commits: number;
  prs: number;
  issues: number;
  pushes: number;
  eventsScanned: number;
  recentActivityScore: number;
  lastActivityAt: string | null;
}

export interface AnalyzedProfile {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  accountCreatedAt: string;
  accountAgeYears: number;
  score: number;
  level: string;
  topLanguage: string;
  avgStarsPerRepo: number;
  mostStarredRepo: TopRepositoryInsight;
  languages: LanguageInsight[];
  topRepos: TopRepositoryInsight[];
  activityData: ActivityInsight[];
  analyzedAt: string;
  insights: ProfileInsights;
  activitySummary: ActivitySummary;
}

export interface StoredAnalysis extends AnalyzedProfile {
  githubId: number;
  githubProfileUrl: string;
  rawProfile: GitHubUser;
  rawRepos: GitHubRepository[];
  rawEvents: GitHubEvent[];
}

export interface ProfileListItem {
  username: string;
  name: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  score: number;
  level: string;
  topLanguage: string;
  avgStarsPerRepo: number;
  mostStarredRepoName: string;
  mostStarredRepoStars: number;
  accountAgeYears: number;
  analyzedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PagedProfiles {
  items: ProfileListItem[];
  meta: PaginationMeta;
}

export interface ProfileListFilters {
  page: number;
  limit: number;
  sortBy: 'analyzedAt' | 'score' | 'followers' | 'publicRepos' | 'totalStars' | 'totalForks' | 'username' | 'topLanguage' | 'level';
  sortOrder: 'asc' | 'desc';
  q?: string;
  level?: string;
  topLanguage?: string;
  minScore?: number;
  maxScore?: number;
  minFollowers?: number;
  maxFollowers?: number;
}

export interface AnalysisResult {
  profile: AnalyzedProfile;
  cached: boolean;
  refreshed: boolean;
}
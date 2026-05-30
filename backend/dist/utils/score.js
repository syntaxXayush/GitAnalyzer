"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDeveloperScore = buildDeveloperScore;
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function buildDeveloperScore(input) {
    const totalStars = input.repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const repoCount = input.repositories.length;
    const followersScore = Math.sqrt(input.user.followers) * 18;
    const repoScore = Math.sqrt(Math.max(repoCount, 1)) * 22;
    const starsScore = Math.sqrt(Math.max(totalStars, 1)) * 10;
    const forksScore = Math.sqrt(Math.max(input.repositories.reduce((sum, repo) => sum + repo.forks_count, 0), 1)) * 8;
    const diversityScore = input.languages.length * 12;
    const activityScore = clamp(input.activitySummary.recentActivityScore, 0, 220);
    const longevityScore = clamp(Number((input.activitySummary.eventsScanned / 5).toFixed(0)), 0, 60);
    const rawScore = followersScore + repoScore + starsScore + forksScore + diversityScore + activityScore + longevityScore;
    const score = Math.round(clamp(rawScore, 0, 1000));
    const level = score >= 900
        ? 'Legend'
        : score >= 780
            ? 'Expert'
            : score >= 620
                ? 'Senior'
                : score >= 450
                    ? 'Builder'
                    : score >= 280
                        ? 'Emerging'
                        : 'Starter';
    const topLanguage = input.languages[0]?.name ?? 'Unknown';
    const mostStarredRepo = input.repositories.reduce((best, repo) => {
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
    }, null);
    const strengths = [
        `${input.user.followers} followers show visible reach`,
        `${repoCount} public repositories demonstrate shipping cadence`,
        `${topLanguage} is the clearest primary language signal`,
    ];
    const opportunities = [
        input.activitySummary.recentActivityScore < 80 ? 'Increase recent public activity cadence' : 'Keep recent activity consistent',
        input.languages.length < 3 ? 'Broaden language coverage with a second or third stack' : 'Consolidate the strongest language ecosystems',
        totalStars < 100 ? 'Grow starred utility projects or reference repos' : 'Package top repositories with stronger documentation',
    ];
    const riskFlags = [
        repoCount === 0 ? 'No public repositories available for analysis' : null,
        input.user.followers === 0 ? 'No followers yet, so social reach is limited' : null,
        input.repositories.every((repo) => repo.stargazers_count === 0) ? 'No repository has attracted stars yet' : null,
    ].filter(Boolean);
    return {
        score,
        level,
        insights: {
            summary: `${input.user.login} reads as a ${level.toLowerCase()}-tier developer with ${repoCount} public repos, ${input.user.followers} followers, and ${totalStars} total stars.`,
            strengths,
            opportunities,
            activitySignal: input.activitySummary.recentActivityScore > 140
                ? 'High recent public activity'
                : input.activitySummary.recentActivityScore > 70
                    ? 'Moderate recent public activity'
                    : 'Low recent public activity',
            riskFlags,
        },
    };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiDocument = void 0;
exports.openApiDocument = {
    openapi: '3.0.3',
    info: {
        title: 'GitAnalyzer API',
        version: '1.0.0',
        description: 'Production-ready GitHub profile analysis API built with Express, MySQL, and the GitHub REST API.',
    },
    servers: [
        { url: 'http://localhost:4000', description: 'Local development server' },
    ],
    tags: [
        { name: 'Health', description: 'Service health and readiness' },
        { name: 'Profiles', description: 'GitHub profile analysis and profile intelligence' },
    ],
    components: {
        schemas: {
            AnalysisRequest: {
                type: 'object',
                required: ['username'],
                properties: {
                    username: { type: 'string', example: 'torvalds' },
                    forceRefresh: { type: 'boolean', example: false },
                },
            },
            MostStarredRepo: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    stars: { type: 'number' },
                    forks: { type: 'number' },
                    language: { type: 'string' },
                    pushedAt: { type: 'string', format: 'date-time' },
                },
            },
            ProfileLanguage: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    count: { type: 'number' },
                    pct: { type: 'number' },
                },
            },
            ActivityPoint: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    month: { type: 'string' },
                    commits: { type: 'number' },
                    prs: { type: 'number' },
                },
            },
            AnalyzedProfile: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    name: { type: 'string' },
                    avatarUrl: { type: 'string' },
                    bio: { type: 'string' },
                    location: { type: 'string' },
                    company: { type: 'string' },
                    blog: { type: 'string' },
                    publicRepos: { type: 'number' },
                    followers: { type: 'number' },
                    following: { type: 'number' },
                    totalStars: { type: 'number' },
                    totalForks: { type: 'number' },
                    accountCreatedAt: { type: 'string' },
                    accountAgeYears: { type: 'number' },
                    score: { type: 'number' },
                    level: { type: 'string' },
                    topLanguage: { type: 'string' },
                    avgStarsPerRepo: { type: 'number' },
                    mostStarredRepo: { $ref: '#/components/schemas/MostStarredRepo' },
                    languages: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ProfileLanguage' },
                    },
                    topRepos: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/MostStarredRepo' },
                    },
                    activityData: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ActivityPoint' },
                    },
                    analyzedAt: { type: 'string' },
                },
            },
            ProfileListItem: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    name: { type: 'string' },
                    avatarUrl: { type: 'string' },
                    publicRepos: { type: 'number' },
                    followers: { type: 'number' },
                    following: { type: 'number' },
                    totalStars: { type: 'number' },
                    totalForks: { type: 'number' },
                    score: { type: 'number' },
                    level: { type: 'string' },
                    topLanguage: { type: 'string' },
                    avgStarsPerRepo: { type: 'number' },
                    mostStarredRepoName: { type: 'string' },
                    mostStarredRepoStars: { type: 'number' },
                    accountAgeYears: { type: 'number' },
                    analyzedAt: { type: 'string' },
                },
            },
            PaginationMeta: {
                type: 'object',
                properties: {
                    page: { type: 'number' },
                    limit: { type: 'number' },
                    total: { type: 'number' },
                    totalPages: { type: 'number' },
                },
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                        type: 'object',
                        properties: {
                            code: { type: 'string' },
                            message: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
    paths: {
        '/health': {
            get: {
                tags: ['Health'],
                summary: 'Health check',
                responses: {
                    200: { description: 'OK' },
                },
            },
        },
        '/api/v1/profiles/analyze': {
            post: {
                tags: ['Profiles'],
                summary: 'Analyze a GitHub profile',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AnalysisRequest' },
                        },
                    },
                },
                responses: {
                    201: { description: 'Profile analyzed and stored' },
                },
            },
        },
        '/api/v1/profiles': {
            get: {
                tags: ['Profiles'],
                summary: 'Retrieve analyzed profiles',
                responses: {
                    200: { description: 'Paginated profiles' },
                },
            },
        },
        '/api/v1/profiles/{username}': {
            get: {
                tags: ['Profiles'],
                summary: 'Get a single analyzed profile by username',
                parameters: [
                    {
                        name: 'username',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: { description: 'Profile found' },
                    404: { description: 'Profile not found' },
                },
            },
            patch: {
                tags: ['Profiles'],
                summary: 'Refresh an existing analysis',
                parameters: [
                    {
                        name: 'username',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: { description: 'Profile refreshed' },
                },
            },
            delete: {
                tags: ['Profiles'],
                summary: 'Delete an analyzed profile',
                parameters: [
                    {
                        name: 'username',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    204: { description: 'Profile deleted' },
                },
            },
        },
    },
};

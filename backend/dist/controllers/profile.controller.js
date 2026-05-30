"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
class ProfileController {
    service;
    constructor(service) {
        this.service = service;
    }
    analyze = async (req, res) => {
        const body = req.validated?.body ?? req.body;
        const username = extractSingleString(body.username);
        const forceRefresh = Boolean(body.forceRefresh);
        const result = await this.service.analyze(username, Boolean(forceRefresh));
        res.status(result.cached ? 200 : 201).json({
            success: true,
            data: result.profile,
            meta: {
                cached: result.cached,
                refreshed: result.refreshed,
            },
        });
    };
    refresh = async (req, res) => {
        const params = req.validated?.params ?? req.params;
        const username = extractSingleString(params.username);
        const result = await this.service.analyze(username, true);
        res.status(200).json({
            success: true,
            data: result.profile,
            meta: {
                cached: false,
                refreshed: true,
            },
        });
    };
    findOne = async (req, res) => {
        const params = req.validated?.params ?? req.params;
        const username = extractSingleString(params.username);
        const profile = await this.service.findByUsername(username);
        if (!profile) {
            res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: `No analyzed profile found for ${username}`,
                },
            });
            return;
        }
        res.json({
            success: true,
            data: profile,
        });
    };
    list = async (req, res) => {
        const query = req.validated?.query ?? req.query;
        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 12);
        const result = await this.service.list({
            page,
            limit,
            sortBy: query.sortBy ?? 'analyzedAt',
            sortOrder: query.sortOrder ?? 'desc',
            q: extractOptionalString(query.q),
            level: extractOptionalString(query.level),
            topLanguage: extractOptionalString(query.topLanguage),
            minScore: query.minScore ? Number(query.minScore) : undefined,
            maxScore: query.maxScore ? Number(query.maxScore) : undefined,
            minFollowers: query.minFollowers ? Number(query.minFollowers) : undefined,
            maxFollowers: query.maxFollowers ? Number(query.maxFollowers) : undefined,
        });
        res.json({
            success: true,
            data: result.items,
            meta: result.meta,
        });
    };
    delete = async (req, res) => {
        const params = req.validated?.params ?? req.params;
        const username = extractSingleString(params.username);
        const deleted = await this.service.delete(username);
        if (!deleted) {
            res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: `No analyzed profile found for ${username}`,
                },
            });
            return;
        }
        res.status(204).send();
    };
}
exports.ProfileController = ProfileController;
function extractSingleString(value) {
    if (Array.isArray(value)) {
        return String(value[0] ?? '');
    }
    return String(value ?? '');
}
function extractOptionalString(value) {
    const extracted = extractSingleString(value);
    return extracted.length > 0 ? extracted : undefined;
}

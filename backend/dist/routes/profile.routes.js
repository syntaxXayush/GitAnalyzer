"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProfileRoutes = buildProfileRoutes;
const express_1 = require("express");
const zod_1 = require("zod");
const validate_request_1 = require("../middlewares/validate-request");
const analyzeSchema = zod_1.z.object({
    username: zod_1.z.string().min(1).max(39),
    forceRefresh: zod_1.z.boolean().optional(),
});
const usernameSchema = zod_1.z.object({
    username: zod_1.z.string().min(1).max(39),
});
const listSchema = zod_1.z.object({
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['analyzedAt', 'score', 'followers', 'publicRepos', 'totalStars', 'totalForks', 'username', 'topLanguage', 'level']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    q: zod_1.z.string().optional(),
    level: zod_1.z.string().optional(),
    topLanguage: zod_1.z.string().optional(),
    minScore: zod_1.z.string().optional(),
    maxScore: zod_1.z.string().optional(),
    minFollowers: zod_1.z.string().optional(),
    maxFollowers: zod_1.z.string().optional(),
});
function buildProfileRoutes(controller) {
    const router = (0, express_1.Router)();
    router.get('/', (0, validate_request_1.validateRequest)({ query: listSchema }), controller.list);
    router.post('/analyze', (0, validate_request_1.validateRequest)({ body: analyzeSchema }), controller.analyze);
    router.get('/:username', (0, validate_request_1.validateRequest)({ params: usernameSchema }), controller.findOne);
    router.patch('/:username/refresh', (0, validate_request_1.validateRequest)({ params: usernameSchema }), controller.refresh);
    router.delete('/:username', (0, validate_request_1.validateRequest)({ params: usernameSchema }), controller.delete);
    return router;
}

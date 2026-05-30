"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRoutes = buildRoutes;
const express_1 = require("express");
const profile_routes_1 = require("./profile.routes");
const health_routes_1 = require("./health.routes");
function buildRoutes(profileController) {
    const router = (0, express_1.Router)();
    router.use('/health', (0, health_routes_1.buildHealthRoutes)());
    router.use('/profiles', (0, profile_routes_1.buildProfileRoutes)(profileController));
    return router;
}

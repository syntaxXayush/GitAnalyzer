"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHealthRoutes = buildHealthRoutes;
const express_1 = require("express");
function buildHealthRoutes() {
    const router = (0, express_1.Router)();
    router.get('/', (_req, res) => {
        res.json({
            success: true,
            data: {
                status: 'ok',
                timestamp: new Date().toISOString(),
            },
        });
    });
    return router;
}

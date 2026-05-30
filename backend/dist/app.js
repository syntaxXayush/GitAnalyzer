"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const pino_http_1 = __importDefault(require("pino-http"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const rate_limit_1 = require("./middlewares/rate-limit");
const error_handler_1 = require("./middlewares/error-handler");
const openapi_1 = require("./docs/openapi");
const routes_1 = require("./routes");
const profile_controller_1 = require("./controllers/profile.controller");
const profile_analysis_service_1 = require("./services/profile-analysis.service");
const mysql_profile_repository_1 = require("./repositories/mysql-profile.repository");
const database_1 = require("./config/database");
const github_service_1 = require("./services/github.service");
function createApp() {
    const app = (0, express_1.default)();
    const repository = new mysql_profile_repository_1.MysqlProfileRepository(database_1.pool);
    const githubService = new github_service_1.GitHubService();
    const analysisService = new profile_analysis_service_1.ProfileAnalysisService(repository, githubService);
    const profileController = new profile_controller_1.ProfileController(analysisService);
    app.use((0, pino_http_1.default)({ logger: logger_1.logger }));
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({ origin: env_1.env.corsOrigin, credentials: true }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(rate_limit_1.apiRateLimiter);
    app.get('/', (_req, res) => {
        res.json({
            success: true,
            message: 'GitAnalyzer API is running',
            docs: '/docs',
            health: '/health',
        });
    });
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_1.openApiDocument, { explorer: true }));
    app.use(env_1.env.apiPrefix, (0, routes_1.buildRoutes)(profileController));
    app.use(error_handler_1.notFoundHandler);
    app.use(error_handler_1.errorHandler);
    return app;
}

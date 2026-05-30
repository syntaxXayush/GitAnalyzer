"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const app_1 = require("./app");
async function bootstrap() {
    const app = (0, app_1.createApp)();
    const connection = await database_1.pool.getConnection();
    connection.release();
    app.listen(env_1.env.port, () => {
        logger_1.logger.info(`GitAnalyzer API listening on port ${env_1.env.port}`);
    });
}
void bootstrap().catch((error) => {
    logger_1.logger.error({ err: error }, 'Failed to start GitAnalyzer API');
    process.exit(1);
});

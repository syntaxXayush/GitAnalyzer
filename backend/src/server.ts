import { pool } from './config/database';
import { env } from './config/env';
import { logger } from './config/logger';
import { createApp } from './app';

async function bootstrap() {
  const app = createApp();

  const connection = await pool.getConnection();
  connection.release();

  app.listen(env.port, () => {
    logger.info(`GitAnalyzer API listening on port ${env.port}`);
  });
}

void bootstrap().catch((error) => {
  logger.error({ err: error }, 'Failed to start GitAnalyzer API');
  process.exit(1);
});
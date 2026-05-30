import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { apiRateLimiter } from './middlewares/rate-limit';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';
import { openApiDocument } from './docs/openapi';
import { buildRoutes } from './routes';
import { ProfileController } from './controllers/profile.controller';
import { ProfileAnalysisService } from './services/profile-analysis.service';
import { MysqlProfileRepository } from './repositories/mysql-profile.repository';
import { pool } from './config/database';
import { GitHubService } from './services/github.service';

export function createApp() {
  const app = express();

  const repository = new MysqlProfileRepository(pool);
  const githubService = new GitHubService();
  const analysisService = new ProfileAnalysisService(repository, githubService);
  const profileController = new ProfileController(analysisService);

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(apiRateLimiter);

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'GitAnalyzer API is running',
      docs: '/docs',
      health: '/health',
    });
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, { explorer: true }));
  app.use(env.apiPrefix, buildRoutes(profileController));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
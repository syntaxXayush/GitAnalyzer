import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { buildProfileRoutes } from './profile.routes';
import { buildHealthRoutes } from './health.routes';

export function buildRoutes(profileController: ProfileController): Router {
  const router = Router();

  router.use('/health', buildHealthRoutes());
  router.use('/profiles', buildProfileRoutes(profileController));

  return router;
}
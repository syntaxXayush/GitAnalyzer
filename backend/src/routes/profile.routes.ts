import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validate-request';
import { ProfileController } from '../controllers/profile.controller';

const analyzeSchema = z.object({
  username: z.string().min(1).max(39),
  forceRefresh: z.boolean().optional(),
});

const usernameSchema = z.object({
  username: z.string().min(1).max(39),
});

const listSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.enum(['analyzedAt', 'score', 'followers', 'publicRepos', 'totalStars', 'totalForks', 'username', 'topLanguage', 'level']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  q: z.string().optional(),
  level: z.string().optional(),
  topLanguage: z.string().optional(),
  minScore: z.string().optional(),
  maxScore: z.string().optional(),
  minFollowers: z.string().optional(),
  maxFollowers: z.string().optional(),
});

export function buildProfileRoutes(controller: ProfileController): Router {
  const router = Router();

  router.get('/', validateRequest({ query: listSchema }), controller.list);
  router.post('/analyze', validateRequest({ body: analyzeSchema }), controller.analyze);
  router.get('/:username', validateRequest({ params: usernameSchema }), controller.findOne);
  router.patch('/:username/refresh', validateRequest({ params: usernameSchema }), controller.refresh);
  router.delete('/:username', validateRequest({ params: usernameSchema }), controller.delete);

  return router;
}
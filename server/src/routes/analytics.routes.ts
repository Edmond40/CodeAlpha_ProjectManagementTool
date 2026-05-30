import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getAnalytics } from '../controllers/analytics.controller';

export const analyticsRouter = Router();
analyticsRouter.use(authenticate);
analyticsRouter.get('/team/:teamId', getAnalytics);

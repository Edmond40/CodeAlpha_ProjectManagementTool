import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getActivity } from '../controllers/activity.controller';

export const activityRouter = Router();
activityRouter.use(authenticate);
activityRouter.get('/team/:teamId', getActivity);

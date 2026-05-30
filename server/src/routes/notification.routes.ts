import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getNotifications, updateNotification } from '../controllers/notification.controller';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const updateNotificationSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ state: z.enum(['READ', 'UNREAD', 'ARCHIVED']) })
});

export const notificationRouter = Router();
notificationRouter.use(authenticate);
notificationRouter.get('/team/:teamId', getNotifications);
notificationRouter.put('/:id', validate(updateNotificationSchema), updateNotification);

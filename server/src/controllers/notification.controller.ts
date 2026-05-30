import { Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const notifications = await notificationService.getNotifications(req.user.id, req.params.teamId);
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
}

export async function updateNotification(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const notification = await notificationService.updateNotificationState(req.params.id, req.body.state);
    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
}

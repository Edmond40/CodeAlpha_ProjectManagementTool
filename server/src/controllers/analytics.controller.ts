import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analytics.service';

export async function getAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const analytics = await analyticsService.getTeamAnalytics(req.params.teamId);
    res.json({ success: true, analytics });
  } catch (error) {
    next(error);
  }
}

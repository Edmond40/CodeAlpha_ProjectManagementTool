import { Request, Response, NextFunction } from 'express';
import * as activityService from '../services/activity.service';

export async function getActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const activity = await activityService.getTeamActivity(req.params.teamId);
    res.json({ success: true, activity });
  } catch (error) {
    next(error);
  }
}

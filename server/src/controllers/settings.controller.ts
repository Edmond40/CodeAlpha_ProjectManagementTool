import { Request, Response, NextFunction } from 'express';
import * as settingsService from '../services/settings.service';

export async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await settingsService.getTeamSettings(req.params.id);
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await settingsService.updateTeamSettings(req.params.id, req.body);
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
}

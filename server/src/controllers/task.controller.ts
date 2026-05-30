import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';
import { AuthRequest } from '../middleware/auth.middleware';

export async function createTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await taskService.createTask(req.body, req.user.id);
    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

export async function getTeamTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const tasks = await taskService.getTasksByTeam(req.params.teamId);
    res.json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

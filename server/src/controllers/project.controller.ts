import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/project.service';

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
}

export async function getTeamProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await projectService.getProjectsByTeam(req.params.teamId);
    res.json({ success: true, projects });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
}

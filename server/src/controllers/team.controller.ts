import { Request, Response, NextFunction } from 'express';
import * as teamService from '../services/team.service';
import { AuthRequest } from '../middleware/auth.middleware';

export async function createTeam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const team = await teamService.createTeam(req.user.id, req.body);
    res.status(201).json({ success: true, team });
  } catch (error) {
    next(error);
  }
}

export async function getTeams(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const teams = await teamService.getUserTeams(req.user.id);
    res.json({ success: true, teams });
  } catch (error) {
    next(error);
  }
}

export async function getTeam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const team = await teamService.getTeamById(req.params.id);
    res.json({ success: true, team });
  } catch (error) {
    next(error);
  }
}

export async function updateTeam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const team = await teamService.updateTeam(req.params.id, req.body);
    res.json({ success: true, team });
  } catch (error) {
    next(error);
  }
}

export async function deleteTeam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await teamService.deleteTeam(req.params.id);
    res.json({ success: true, message: 'Team deleted or archived' });
  } catch (error) {
    next(error);
  }
}

export async function inviteMember(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const invitation = await teamService.inviteMember(req.params.id, req.user.id, req.body.email, req.body.role);
    res.status(201).json({ success: true, invitation });
  } catch (error) {
    next(error);
  }
}

export async function listMembers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const members = await teamService.listTeamMembers(req.params.id);
    res.json({ success: true, members });
  } catch (error) {
    next(error);
  }
}

export async function updateMember(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const member = await teamService.updateTeamMemberRole(req.params.id, req.params.memberId, req.body.role);
    res.json({ success: true, member });
  } catch (error) {
    next(error);
  }
}

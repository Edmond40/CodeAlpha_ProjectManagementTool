import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import prisma from '../prisma/client';

export async function resolveTeam(req: AuthRequest, res: Response, next: NextFunction) {
  const teamId = req.params.id || req.body.teamId || req.teamId;
  if (!teamId) {
    return next(new ForbiddenError('Team id missing'));
  }

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    return next(new NotFoundError('Team not found'));
  }

  req.teamId = team.id;
  res.locals.team = team;
  next();
}

import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth.middleware';
import { ForbiddenError } from '../utils/errors';
import prisma from '../prisma/client';

export function requireRole(...allowedRoles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const teamId = req.teamId;
    const user = req.user;

    if (!user || !teamId) {
      return next(new ForbiddenError('Team context required'));
    }

    const membership = await prisma.teamMember.findFirst({
      where: {
        userId: user.id,
        teamId
      }
    });

    if (!membership || !allowedRoles.includes(membership.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}

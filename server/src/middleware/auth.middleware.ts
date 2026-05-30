import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import { verifyToken } from '../utils/jwt';
import prisma from '../prisma/client';

export interface AuthRequest extends Request {
  user?: any;
  teamId?: string;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader?.split(' ')[1] : undefined;

  if (!token) {
    return next(new UnauthorizedError('Authentication token missing'));
  }

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    req.teamId = payload.teamId;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

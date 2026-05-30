import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

export function errorHandler(err: Error | ApiError, req: Request, res: Response, next: NextFunction) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal server error';
  const details = err instanceof ApiError ? err.details : undefined;

  console.error(err);
  res.status(statusCode).json({
    success: false,
    message,
    details
  });
}

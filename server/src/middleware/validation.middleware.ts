import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

export function validate(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const input = {
      body: req.body,
      params: req.params,
      query: req.query
    };

    const result = schema.safeParse(input);
    if (!result.success) {
      return next(new ValidationError('Validation failed', result.error.format()));
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;
    next();
  };
}

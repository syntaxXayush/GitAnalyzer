import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { ValidationError } from '../errors/app-error';

interface ValidationSchemaMap {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export function validateRequest(schemaMap: ValidationSchemaMap) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated: Record<string, unknown> = {};

      if (schemaMap.body) {
        validated.body = schemaMap.body.parse(req.body);
      }

      if (schemaMap.query) {
        validated.query = schemaMap.query.parse(req.query);
      }

      if (schemaMap.params) {
        validated.params = schemaMap.params.parse(req.params);
      }

      res.locals.validated = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError('Request validation failed', error.flatten()));
        return;
      }

      next(error);
    }
  };
}
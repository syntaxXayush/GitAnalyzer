import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { AppError } from '../errors/app-error';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const appError = error instanceof AppError ? error : new AppError('Unexpected server error');

  logger.error(
    {
      err: error,
      requestId: req.headers['x-request-id'],
      path: req.originalUrl,
      method: req.method,
    },
    appError.message,
  );

  res.status(appError.statusCode).json({
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
      details: appError.details,
    },
  });
}
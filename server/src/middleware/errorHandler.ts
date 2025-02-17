import { NextFunction, Request, Response } from 'express';
import { logError } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logError(err, {
    statusCode,
    method: req.method,
    url: req.url,
    ip: req.ip,
    message,
  });

  next();
};

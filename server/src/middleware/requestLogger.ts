import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../utils/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const startTime = Date.now();

  // Log when the request completes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logRequest(req, 'Request completed', {
      duration,
      status: res.statusCode,
      contentLength: res.get('content-length'),
    });
  });

  next();
};

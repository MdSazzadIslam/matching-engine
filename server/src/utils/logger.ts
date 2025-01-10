import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Request } from 'express';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Define interfaces for metadata
interface LogMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

interface RequestLogMetadata extends LogMetadata {
  method: string;
  url: string;
  ip: string;
}

interface ErrorLogMetadata extends LogMetadata {
  stack?: string;
}

// Custom log format
const logFormat = printf(
  ({ level, message, timestamp, stack, ...metadata }) => {
    let log = `${timestamp} [${level}]: ${message}`;

    // Add metadata if exists
    if (Object.keys(metadata).length > 0) {
      log += ` ${JSON.stringify(metadata)}`;
    }

    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }

    return log;
  },
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat,
  ),
  transports: [
    // Write to console in development
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),

    // Write all logs with importance level of 'error' or less to 'error.log'
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    }),

    // Write all logs with importance level of 'info' or less to 'combined.log'
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// Request logger helper
export const logRequest = (
  req: Request,
  message: string,
  metadata: LogMetadata = {},
): void => {
  const requestMetadata: RequestLogMetadata = {
    method: req.method,
    url: req.url,
    ip: req.ip as string,
    ...metadata,
  };

  logger.info(message, requestMetadata);
};

// Error logger helper
export const logError = (error: Error, metadata: LogMetadata = {}): void => {
  const errorMetadata: ErrorLogMetadata = {
    stack: error.stack,
    ...metadata,
  };

  logger.error(error.message, errorMetadata);
};

export default logger;

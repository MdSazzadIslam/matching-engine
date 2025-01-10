import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Request } from 'express';
import logger, { logRequest, logError } from '../../src/utils/logger';

// Mock winston and winston-daily-rotate-file
jest.mock('winston', () => {
  const mockFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    colorize: jest.fn(),
    errors: jest.fn()
  };
  
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn()
  };

  return {
    format: mockFormat,
    createLogger: jest.fn(() => mockLogger),
    transports: {
      Console: jest.fn()
    }
  };
});

jest.mock('winston-daily-rotate-file', () => {
  return jest.fn();
});

describe('Logger', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('Logger Configuration', () => {
    it('should create logger with default log level if LOG_LEVEL not set', () => {
      delete process.env.LOG_LEVEL;
      
      // Re-import logger to trigger new instance creation
      jest.isolateModules(() => {
        require('../../src/utils/logger');
      });

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'info'
        })
      );
    });

    it('should create logger with configured LOG_LEVEL if set', () => {
      process.env.LOG_LEVEL = 'debug';
      
      jest.isolateModules(() => {
        require('../../src/utils/logger');
      });

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'debug'
        })
      );
    });

    it('should configure all required transports', () => {
      jest.isolateModules(() => {
        require('../../src/utils/logger');
      });

      // Verify Console transport
      expect(winston.transports.Console).toHaveBeenCalled();

      // Verify DailyRotateFile transports
      expect(DailyRotateFile).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: 'logs/error-%DATE%.log',
          level: 'error'
        })
      );

      expect(DailyRotateFile).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: 'logs/combined-%DATE%.log'
        })
      );
    });

    it('should configure correct format options', () => {
      jest.isolateModules(() => {
        require('../../src/utils/logger');
      });

      expect(winston.format.timestamp).toHaveBeenCalledWith({
        format: 'YYYY-MM-DD HH:mm:ss'
      });

      expect(winston.format.errors).toHaveBeenCalledWith({
        stack: true
      });

      expect(winston.format.combine).toHaveBeenCalled();
    });
  });

  describe('logRequest', () => {
    it('should log request details with provided message', () => {
      const mockReq = {
        method: 'GET',
        url: '/test',
        ip: '127.0.0.1'
      } as Request;

      const message = 'Test request';
      const metadata = { additionalInfo: 'test' };

      logRequest(mockReq, message, metadata);

      expect(logger.info).toHaveBeenCalledWith(message, {
        method: 'GET',
        url: '/test',
        ip: '127.0.0.1',
        additionalInfo: 'test'
      });
    });

    it('should work without optional metadata', () => {
      const mockReq = {
        method: 'POST',
        url: '/api',
        ip: '127.0.0.1'
      } as Request;

      logRequest(mockReq, 'Test message');

      expect(logger.info).toHaveBeenCalledWith('Test message', {
        method: 'POST',
        url: '/api',
        ip: '127.0.0.1'
      });
    });
  });

  describe('logError', () => {
    it('should log error with stack trace and metadata', () => {
      const error = new Error('Test error');
      const metadata = { context: 'test' };

      logError(error, metadata);

      expect(logger.error).toHaveBeenCalledWith(error.message, {
        stack: error.stack,
        context: 'test'
      });
    });

    it('should work without optional metadata', () => {
      const error = new Error('Test error');

      logError(error);

      expect(logger.error).toHaveBeenCalledWith(error.message, {
        stack: error.stack
      });
    });
  });
});
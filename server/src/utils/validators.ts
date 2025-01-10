import { Request } from 'express';
import logger from './logger';

type ValidationResult = {
  isValid: boolean;
  error?: string;
  value?: unknown;
};

export class Validators {
  private static readonly ALLOWED_MIME_TYPE = 'text/plain' as const;
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  public static validateFile(
    file: Express.Multer.File | undefined,
    req: Request,
  ): { isValid: boolean; error?: string } {
    if (!file) {
      logger.error('No file uploaded', { method: req.method, url: req.url });
      return {
        isValid: false,
        error: 'No file uploaded',
      };
    }

    if (file.mimetype !== this.ALLOWED_MIME_TYPE) {
      logger.error('Invalid file type', {
        method: req.method,
        url: req.url,
        fileType: file.mimetype,
      });
      return {
        isValid: false,
        error: 'Invalid file type: only .txt files are allowed',
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      logger.error('File too large', {
        method: req.method,
        url: req.url,
        fileSize: file.size,
      });
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    return {
      isValid: true,
    };
  }

  public static validateObjectId = (id: string): ValidationResult => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;

    if (!id) {
      return {
        isValid: false,
        error: 'ID is required',
      };
    }

    if (!objectIdPattern.test(id)) {
      return {
        isValid: false,
        error: `Invalid ID format: ${id} must be a 24-character hex string`,
      };
    }

    return {
      isValid: true,
      value: id,
    };
  };
}

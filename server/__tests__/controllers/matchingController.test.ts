import { MatchingController } from '../../src/controllers/matchingController';
import { MatchingEngine } from '../../src/services/matchingEngine';
import { Request, Response } from 'express';
import { MatchingResult } from '../../src/types';
import { Validators } from '../../src/utils/validators';
import logger from '../../src/utils/logger';

jest.mock('../../src/services/matchingEngine');
jest.mock('../../src/utils/logger', () => ({
    error: jest.fn(),
    info: jest.fn()
  }));

describe('MatchingController', () => {
  let matchingController: MatchingController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
    matchingController = new MatchingController();
  });

  describe('calculate', () => {
    it('should successfully process matching and return results', async () => {
      const mockFileContent = 'test file content';
      const mockResults: MatchingResult[] = [
        { vacancyId: 'V1', candidateId: 'C1', overallScore: 90 }
      ];

      mockRequest = {
        file: {
          buffer: Buffer.from(mockFileContent),
          mimetype: 'text/plain'
        } as Express.Multer.File
      };

      jest.spyOn(MatchingEngine.prototype, 'process').mockReturnValue(mockResults);

      await matchingController.calculate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(MatchingEngine.prototype.process).toHaveBeenCalledWith(mockFileContent);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        results: 'V1,C1,90'
      });
    });

    it('should handle missing file error', async () => {
      mockRequest = {};

      await matchingController.calculate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'No file uploaded'
      });
    });

    it('should handle invalid file type', async () => {
      mockRequest = {
        file: {
          mimetype: 'application/pdf'
        } as Express.Multer.File
      };

      await matchingController.calculate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Invalid file type: only .txt files are allowed'
      });
    });

    it('should handle processing errors', async () => {
      const mockFileContent = 'test file content';
      const mockError = new Error('Processing failed');

      mockRequest = {
        file: {
          buffer: Buffer.from(mockFileContent),
          mimetype: 'text/plain'
        } as Express.Multer.File
      };

      jest.spyOn(MatchingEngine.prototype, 'process').mockImplementation(() => {
        throw mockError;
      });

      await matchingController.calculate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Processing failed'
      });
    });
  });
}); 

// FileValidator tests
describe('FileValidator', () => {
    let mockRequest: Partial<Request>;
  
    beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks();
      
      mockRequest = {
        method: 'POST',
        url: '/test',
        ip: '127.0.0.1'
      } as Partial<Request>;
    });
  
    describe('validateFile', () => {
      it('should validate text files successfully', () => {
        const mockFile = {
          mimetype: 'text/plain',
          size: 1024,
          originalname: 'test.txt'
        } as Express.Multer.File;
  
        const result = Validators.validateFile(mockFile, mockRequest as Request);
  
        expect(result).toEqual({
          isValid: true
        });
        expect(logger.error).not.toHaveBeenCalled();
      });
  
      it('should reject files with invalid mime types', () => {
        const mockFile = {
          mimetype: 'application/pdf',
          size: 1024,
          originalname: 'test.pdf'
        } as Express.Multer.File;
  
        const result = Validators.validateFile(mockFile, mockRequest as Request);
  
        expect(result).toEqual({
          isValid: false,
          error: 'Invalid file type: only .txt files are allowed'
        });
        expect(logger.error).toHaveBeenCalledWith('Invalid file type', {
          method: mockRequest.method,
          url: mockRequest.url,
          fileType: mockFile.mimetype
        });
      });
  
      it('should reject files that exceed size limit', () => {
        const mockFile = {
          mimetype: 'text/plain',
          size: 11 * 1024 * 1024, // 11MB (exceeds 10MB limit)
          originalname: 'large.txt'
        } as Express.Multer.File;
  
        const result = Validators.validateFile(mockFile, mockRequest as Request);
  
        expect(result).toEqual({
          isValid: false,
          error: 'File size exceeds maximum allowed size of 10MB'
        });
        expect(logger.error).toHaveBeenCalledWith('File too large', {
          method: mockRequest.method,
          url: mockRequest.url,
          fileSize: mockFile.size
        });
      });
  
      it('should handle missing file', () => {
        const result = Validators.validateFile(undefined, mockRequest as Request);
  
        expect(result).toEqual({
          isValid: false,
          error: 'No file uploaded'
        });
        expect(logger.error).toHaveBeenCalledWith('No file uploaded', {
          method: mockRequest.method,
          url: mockRequest.url
        });
      });
    });
  });
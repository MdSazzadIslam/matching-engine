import { Request } from "express";
import { Validators } from "../../src/utils/validators";
import logger from "../../src/utils/logger";

// Mock logger
jest.mock("../../src/utils/logger", () => ({
  error: jest.fn(),
}));

describe("Validators", () => {
  const mockRequest = {
    method: "POST",
    url: "/test",
  } as Request;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateFile", () => {
    it("should return error when no file is provided", () => {
      const result = Validators.validateFile(undefined, mockRequest);

      expect(result).toEqual({
        isValid: false,
        error: "No file uploaded",
      });
      expect(logger.error).toHaveBeenCalledWith("No file uploaded", {
        method: "POST",
        url: "/test",
      });
    });

    it("should validate text/plain files successfully", () => {
      const mockFile = {
        mimetype: "text/plain",
        size: 1024 * 1024, // 1MB
      } as Express.Multer.File;

      const result = Validators.validateFile(mockFile, mockRequest);

      expect(result).toEqual({
        isValid: true,
      });
      expect(logger.error).not.toHaveBeenCalled();
    });

    // Removed CSV test as it's no longer supported

    it("should reject files with invalid mime types", () => {
      const mockFile = {
        mimetype: "application/pdf",
        size: 1024 * 1024,
      } as Express.Multer.File;

      const result = Validators.validateFile(mockFile, mockRequest);

      expect(result).toEqual({
        isValid: false,
        error: "Invalid file type: only .txt files are allowed",
      });
      expect(logger.error).toHaveBeenCalledWith("Invalid file type", {
        method: "POST",
        url: "/test",
        fileType: "application/pdf",
      });
    });

    it("should reject files larger than 10MB", () => {
      const mockFile = {
        mimetype: "text/plain",
        size: 11 * 1024 * 1024, // 11MB
      } as Express.Multer.File;

      const result = Validators.validateFile(mockFile, mockRequest);

      expect(result).toEqual({
        isValid: false,
        error: "File size exceeds maximum allowed size of 10MB",
      });
      expect(logger.error).toHaveBeenCalledWith("File too large", {
        method: "POST",
        url: "/test",
        fileSize: 11 * 1024 * 1024,
      });
    });

    it("should accept files exactly at size limit", () => {
      const mockFile = {
        mimetype: "text/plain",
        size: 10 * 1024 * 1024, // 10MB
      } as Express.Multer.File;

      const result = Validators.validateFile(mockFile, mockRequest);

      expect(result).toEqual({
        isValid: true,
      });
      expect(logger.error).not.toHaveBeenCalled();
    });
  });

  describe("validateObjectId", () => {
    it("should validate correct 24-character hex string", () => {
      const validId = "507f1f77bcf86cd799439011";
      const result = Validators.validateObjectId(validId);

      expect(result).toEqual({
        isValid: true,
        value: validId,
      });
    });

    it("should reject empty string", () => {
      const result = Validators.validateObjectId("");

      expect(result).toEqual({
        isValid: false,
        error: "ID is required",
      });
    });

    it("should reject undefined", () => {
      const result = Validators.validateObjectId(
        undefined as unknown as string
      );

      expect(result).toEqual({
        isValid: false,
        error: "ID is required",
      });
    });

    it("should reject null", () => {
      const result = Validators.validateObjectId(null as unknown as string);

      expect(result).toEqual({
        isValid: false,
        error: "ID is required",
      });
    });

    it("should reject string shorter than 24 characters", () => {
      const result = Validators.validateObjectId("507f1f77bcf86cd7994390");

      expect(result).toEqual({
        isValid: false,
        error:
          "Invalid ID format: 507f1f77bcf86cd7994390 must be a 24-character hex string",
      });
    });

    it("should reject string longer than 24 characters", () => {
      const result = Validators.validateObjectId("507f1f77bcf86cd7994390111");

      expect(result).toEqual({
        isValid: false,
        error:
          "Invalid ID format: 507f1f77bcf86cd7994390111 must be a 24-character hex string",
      });
    });

    it("should reject string with non-hex characters", () => {
      const result = Validators.validateObjectId("507f1f77bcf86cd79943901g");

      expect(result).toEqual({
        isValid: false,
        error:
          "Invalid ID format: 507f1f77bcf86cd79943901g must be a 24-character hex string",
      });
    });

    it("should reject string with special characters", () => {
      const result = Validators.validateObjectId("507f1f77bcf86cd799439!@#");

      expect(result).toEqual({
        isValid: false,
        error:
          "Invalid ID format: 507f1f77bcf86cd799439!@# must be a 24-character hex string",
      });
    });

    it("should validate correct hex string with uppercase letters", () => {
      const validId = "507F1F77BCF86CD799439011";
      const result = Validators.validateObjectId(validId);

      expect(result).toEqual({
        isValid: true,
        value: validId,
      });
    });

    it("should validate correct hex string with mixed case letters", () => {
      const validId = "507F1f77bCf86cD799439011";
      const result = Validators.validateObjectId(validId);

      expect(result).toEqual({
        isValid: true,
        value: validId,
      });
    });
  });
});

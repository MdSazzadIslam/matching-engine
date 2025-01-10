import express from 'express';

// Define types for our mocks
type MockRouter = {
  use: jest.Mock;
  get: jest.Mock;
  post: jest.Mock;
};

type MockExpress = {
  (): MockRouter;
  json: jest.Mock;
  Router: jest.Mock;
} & jest.Mock;

// Mock the dependencies
jest.mock('express', () => {
  const mockRouter: MockRouter = {
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
  };

  const mockJson = jest.fn(() => 'express-json-middleware');
  
  const mockExpress = jest.fn(() => mockRouter) as MockExpress;
  mockExpress.json = mockJson;
  mockExpress.Router = jest.fn(() => mockRouter);

  return mockExpress;
});

jest.mock('cors', () => jest.fn(() => 'cors-middleware'));
jest.mock('helmet', () => jest.fn(() => 'helmet-middleware'));
jest.mock('compression', () => jest.fn(() => 'compression-middleware'));
jest.mock('multer');
jest.mock('../src/middleware/errorHandler', () => ({
  errorHandler: 'error-handler-middleware'
}));
jest.mock('../src/middleware/requestLogger', () => ({
  requestLogger: 'request-logger-middleware'
}));
jest.mock('../src/routes', () => ({
  __esModule: true,
  default: 'api-routes'
}));

describe('App Configuration', () => {
  let mockApp: MockRouter;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset modules to get a fresh app instance
    jest.isolateModules(() => {
      require('../src/app');
    });

    // Get the mock express instance
    mockApp = (express as unknown as MockExpress)();
  });

  it('should configure basic middleware', () => {
    // Import app to trigger middleware setup
    require('../src/app');

    // Verify middleware setup
    expect(mockApp.use).toHaveBeenCalledWith('helmet-middleware');
    expect(mockApp.use).toHaveBeenCalledWith('cors-middleware');
    expect(mockApp.use).toHaveBeenCalledWith('compression-middleware');
    expect(mockApp.use).toHaveBeenCalledWith('express-json-middleware');
  });

  it('should configure request logger', () => {
    require('../src/app');
    expect(mockApp.use).toHaveBeenCalledWith('request-logger-middleware');
  });

  it('should configure API routes', () => {
    require('../src/app');
    expect(mockApp.use).toHaveBeenCalledWith('/api/v1/harver', 'api-routes');
  });

  it('should configure error handler', () => {
    require('../src/app');
    expect(mockApp.use).toHaveBeenCalledWith('error-handler-middleware');
  });

  it('should configure 404 handler', () => {
    require('../src/app');
    
    // Get the 404 handler
    const notFoundHandler = mockApp.use.mock.calls.find(
      call => call.length === 1 && typeof call[0] === 'function'
    )?.[0];

    expect(notFoundHandler).toBeDefined();

    if (notFoundHandler) {
      const mockReq = {
        method: 'GET',
        url: '/non-existent-route'
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      notFoundHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not Found' });
    }
  });
}); 
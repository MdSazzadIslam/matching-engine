import multer from 'multer';
import { matchingRoutes } from '../../src/routes/matchingRoutes';

// Mock the calculate method
const mockCalculate = jest.fn();

// Mock dependencies
jest.mock('multer', () => {
  const mockSingle = jest.fn(() => 'multer-middleware');
  return jest.fn(() => ({
    single: mockSingle
  }));
});

jest.mock('../../src/controllers/matchingController', () => {
  return {
    MatchingController: jest.fn().mockImplementation(() => ({
      calculate: mockCalculate
    }))
  };
});

// Define types for our mocks
type MockRouter = {
  use: jest.Mock;
  get: jest.Mock;
  post: jest.Mock;
  route: jest.Mock;
};

type MockExpress = jest.Mock<MockRouter> & {
  Router: jest.Mock<MockRouter>;
};

// Create mock router instance
const mockRouter: MockRouter = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  route: jest.fn()
};

// Create mock express
const mockExpress = jest.fn(() => mockRouter) as MockExpress;
mockExpress.Router = jest.fn(() => mockRouter);

jest.mock('express', () => mockExpress);

describe('Matching Routes', () => {
  let router: MockRouter;

  beforeEach(() => {
    jest.clearAllMocks();
    router = mockRouter;
    matchingRoutes(router as any);
  });

  describe('POST /matching/calculate', () => {
    it('should configure route with multer middleware', () => {
      // Verify route was configured
      expect(router.post).toHaveBeenCalledWith(
        '/matching/calculate',
        'multer-middleware',
        expect.any(Function)
      );
    });

    it('should call controller calculate method', async () => {
      // Get the route handler
      const routeHandler = router.post.mock.calls[0][2];

      expect(routeHandler).toBeDefined();

      // Create mock request and response
      const mockReq = {
        file: {
          buffer: Buffer.from('test content'),
          mimetype: 'text/plain'
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Call the handler
      await routeHandler(mockReq, mockRes);

      // Verify controller method was called
      expect(mockCalculate).toHaveBeenCalledWith(mockReq, mockRes);
    });

    it('should configure multer with correct options', () => {
      const multerInstance = multer();
      expect(multerInstance.single).toHaveBeenCalledWith('file');
    });
  });
});
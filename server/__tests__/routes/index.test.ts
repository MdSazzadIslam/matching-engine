import { matchingRoutes } from '../../src/routes/matchingRoutes';

// Mock dependencies
jest.mock('../../src/routes/matchingRoutes', () => ({
  matchingRoutes: jest.fn()
}));

// Define types for our mocks
type MockRouter = {
  use: jest.Mock;
  get: jest.Mock;
  post: jest.Mock;
};

type MockExpress = jest.Mock<MockRouter> & {
  Router: jest.Mock<MockRouter>;
};

// Create mock router instance
const mockRouter: MockRouter = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn()
};

// Create mock express
const mockExpress = jest.fn(() => mockRouter) as MockExpress;
mockExpress.Router = jest.fn(() => mockRouter);

jest.mock('express', () => mockExpress);

describe('Routes Index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should configure matching routes', () => {
    // Import routes to trigger configuration
    require('../../src/routes');

    // Verify matching routes were configured
    expect(matchingRoutes).toHaveBeenCalledWith(mockRouter);
  });
}); 
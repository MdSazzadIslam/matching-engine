import { app } from '../src/app';
import logger from '../src/utils/logger';

// Mock the dependencies
jest.mock('../src/app', () => ({
  app: {
    listen: jest.fn((port, callback) => {
      if (callback) callback();
      return {
        listening: true,
        close: jest.fn()
      };
    })
  }
}));

jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('Server', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should start server on default port if PORT env is not set', () => {
    delete process.env.PORT;
    
    // Import server to trigger the app.listen call
    jest.isolateModules(() => {
      require('../src/server');
    });

    expect(app.listen).toHaveBeenCalledWith("8080", expect.any(Function));
    expect(logger.info).toHaveBeenCalledWith('Server is running on port 8080');
  });

  it('should start server on specified PORT env', () => {
    process.env.PORT = '3000';
    
    // Import server to trigger the app.listen call
    jest.isolateModules(() => {
      require('../src/server');
    });

    expect(app.listen).toHaveBeenCalledWith('3000', expect.any(Function));
    expect(logger.info).toHaveBeenCalledWith('Server is running on port 3000');
  });
});
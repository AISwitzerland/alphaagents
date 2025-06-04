import {
  ErrorHandler,
  ErrorCodes,
  AlphaAgentsError,
  SystemError,
  ConfigurationError,
  ValidationError,
  ExternalServiceError
} from '../errors/ErrorHandler';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = ErrorHandler.getInstance();
    // Clear any existing error listeners
    (errorHandler as any).errorListeners = [];
  });

  describe('Singleton Pattern', () => {
    test('should return same instance', () => {
      const instance1 = ErrorHandler.getInstance();
      const instance2 = ErrorHandler.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('Error Creation', () => {
    test('should create basic AlphaAgentsError', () => {
      const error = errorHandler.createError(
        ErrorCodes.VALIDATION_ERROR,
        'Test validation error',
        true,
        { field: 'email' }
      );
      
      expect(error).toBeInstanceOf(AlphaAgentsError);
      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(error.message).toBe('Test validation error');
      expect(error.retryable).toBe(true);
      expect(error.details).toEqual({ field: 'email' });
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    test('should create SystemError', () => {
      const error = new SystemError('System failure', { component: 'database' });
      
      expect(error).toBeInstanceOf(SystemError);
      expect(error).toBeInstanceOf(AlphaAgentsError);
      expect(error.code).toBe(ErrorCodes.SYSTEM_ERROR);
      expect(error.retryable).toBe(false);
      expect(error.details).toEqual({ component: 'database' });
    });

    test('should create ConfigurationError', () => {
      const error = new ConfigurationError('Missing API key', { key: 'OPENAI_API_KEY' });
      
      expect(error).toBeInstanceOf(ConfigurationError);
      expect(error.code).toBe(ErrorCodes.CONFIGURATION_ERROR);
      expect(error.retryable).toBe(false);
    });

    test('should create ValidationError', () => {
      const error = new ValidationError('Invalid input format', { format: 'email' });
      
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(error.retryable).toBe(false);
    });

    test('should create ExternalServiceError', () => {
      const error = new ExternalServiceError(
        ErrorCodes.OPENAI_API_ERROR,
        'API rate limit exceeded',
        true,
        { retryAfter: '60s' }
      );
      
      expect(error).toBeInstanceOf(ExternalServiceError);
      expect(error.code).toBe(ErrorCodes.OPENAI_API_ERROR);
      expect(error.retryable).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle AlphaAgentsError correctly', () => {
      const originalError = new ValidationError('Invalid email format');
      
      const agentError = errorHandler.handleError(originalError);
      
      expect(agentError.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(agentError.message).toBe('Invalid email format');
      expect(agentError.retryable).toBe(false);
    });

    test('should handle standard Error correctly', () => {
      const originalError = new Error('Standard error message');
      
      const agentError = errorHandler.handleError(originalError, { context: 'test' });
      
      expect(agentError.code).toBe(ErrorCodes.SYSTEM_ERROR);
      expect(agentError.message).toBe('Standard error message');
      expect(agentError.retryable).toBe(false);
      expect(agentError.details).toEqual({ context: 'test' });
      expect(agentError.stack).toBeDefined();
    });

    test('should handle string errors', () => {
      const agentError = errorHandler.handleError('Simple error message');
      
      expect(agentError.code).toBe(ErrorCodes.SYSTEM_ERROR);
      expect(agentError.message).toBe('Simple error message');
      expect(agentError.retryable).toBe(false);
    });

    test('should handle unknown error types', () => {
      const unknownError = { weird: 'object' };
      
      const agentError = errorHandler.handleError(unknownError, { source: 'test' });
      
      expect(agentError.code).toBe(ErrorCodes.SYSTEM_ERROR);
      expect(agentError.message).toBe('Unknown error occurred');
      expect(agentError.retryable).toBe(false);
      expect(agentError.details?.originalError).toBe(unknownError);
      expect(agentError.details?.context).toEqual({ source: 'test' });
    });
  });

  describe('External Error Wrapping', () => {
    test('should wrap external Error', () => {
      const originalError = new Error('API connection failed');
      
      const wrappedError = errorHandler.wrapExternalError(
        ErrorCodes.OPENAI_API_ERROR,
        originalError,
        true
      );
      
      expect(wrappedError).toBeInstanceOf(ExternalServiceError);
      expect(wrappedError.code).toBe(ErrorCodes.OPENAI_API_ERROR);
      expect(wrappedError.message).toBe('API connection failed');
      expect(wrappedError.retryable).toBe(true);
      expect(wrappedError.details?.originalError).toEqual({
        name: originalError.name,
        message: originalError.message,
        stack: originalError.stack
      });
    });

    test('should wrap non-Error objects', () => {
      const originalError = { status: 500, data: 'Server error' };
      
      const wrappedError = errorHandler.wrapExternalError(
        ErrorCodes.SUPABASE_ERROR,
        originalError,
        false
      );
      
      expect(wrappedError.message).toBe('External service error');
      expect(wrappedError.retryable).toBe(false);
      expect(wrappedError.details?.originalError).toBe(originalError);
    });
  });

  describe('Error Listeners', () => {
    test('should add and notify error listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      errorHandler.addErrorListener(listener1);
      errorHandler.addErrorListener(listener2);
      
      const error = new ValidationError('Test error');
      errorHandler.handleError(error);
      
      expect(listener1).toHaveBeenCalledWith(error);
      expect(listener2).toHaveBeenCalledWith(error);
    });

    test('should remove error listeners', () => {
      const listener = jest.fn();
      
      errorHandler.addErrorListener(listener);
      errorHandler.removeErrorListener(listener);
      
      const error = new ValidationError('Test error');
      errorHandler.handleError(error);
      
      expect(listener).not.toHaveBeenCalled();
    });

    test('should handle listener errors gracefully', () => {
      const faultyListener = jest.fn().mockImplementation(() => {
        throw new Error('Listener error');
      });
      
      errorHandler.addErrorListener(faultyListener);
      
      const error = new ValidationError('Test error');
      
      // Should not throw despite listener error
      expect(() => errorHandler.handleError(error)).not.toThrow();
      expect(faultyListener).toHaveBeenCalled();
    });

    test('should only notify listeners for AlphaAgentsError instances', () => {
      const listener = jest.fn();
      errorHandler.addErrorListener(listener);
      
      // Should notify for AlphaAgentsError
      const agentsError = new ValidationError('Test error');
      errorHandler.handleError(agentsError);
      expect(listener).toHaveBeenCalledWith(agentsError);
      
      listener.mockClear();
      
      // Should not notify for standard Error
      const standardError = new Error('Standard error');
      errorHandler.handleError(standardError);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Error Classification', () => {
    test('should identify retryable errors correctly', () => {
      const retryableError = {
        code: ErrorCodes.OPENAI_API_ERROR,
        message: 'Rate limit exceeded',
        retryable: true,
        stack: undefined
      };
      
      const nonRetryableError = {
        code: ErrorCodes.CONFIGURATION_ERROR,
        message: 'Missing API key',
        retryable: false,
        stack: undefined
      };
      
      expect(errorHandler.isRetryable(retryableError)).toBe(true);
      expect(errorHandler.isRetryable(nonRetryableError)).toBe(false);
    });

    test('should identify fatal errors correctly', () => {
      expect(errorHandler.isFatalError(ErrorCodes.CONFIGURATION_ERROR)).toBe(true);
      expect(errorHandler.isFatalError(ErrorCodes.AGENT_INITIALIZATION_FAILED)).toBe(true);
      expect(errorHandler.isFatalError(ErrorCodes.INSUFFICIENT_PERMISSIONS)).toBe(true);
      expect(errorHandler.isFatalError(ErrorCodes.DATA_INTEGRITY_ERROR)).toBe(true);
      
      expect(errorHandler.isFatalError(ErrorCodes.OPENAI_API_ERROR)).toBe(false);
      expect(errorHandler.isFatalError(ErrorCodes.AGENT_TIMEOUT)).toBe(false);
    });

    test('should not retry fatal errors even if marked retryable', () => {
      const fatalButRetryableError = {
        code: ErrorCodes.CONFIGURATION_ERROR,
        message: 'Config error',
        retryable: true, // Marked retryable but is fatal
        stack: undefined
      };
      
      expect(errorHandler.isRetryable(fatalButRetryableError)).toBe(false);
    });
  });

  describe('AgentError Conversion', () => {
    test('should convert AlphaAgentsError to AgentError', () => {
      const error = new ValidationError('Invalid input', { field: 'email' });
      const agentError = error.toAgentError();
      
      expect(agentError.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(agentError.message).toBe('Invalid input');
      expect(agentError.retryable).toBe(false);
      expect(agentError.details).toEqual({ field: 'email' });
      expect(agentError.stack).toBeDefined();
    });
  });
});
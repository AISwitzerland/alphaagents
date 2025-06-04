import { AgentError, LogLevel } from '../../../shared/src/types/agent';

/**
 * Standardized Error Codes for AlphaAgents System
 */
export const ErrorCodes = {
  // System Errors
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  DEPENDENCY_ERROR: 'DEPENDENCY_ERROR',
  
  // Agent Errors
  AGENT_NOT_FOUND: 'AGENT_NOT_FOUND',
  AGENT_DISABLED: 'AGENT_DISABLED',
  AGENT_TIMEOUT: 'AGENT_TIMEOUT',
  AGENT_INITIALIZATION_FAILED: 'AGENT_INITIALIZATION_FAILED',
  
  // Input/Output Errors
  INVALID_INPUT: 'INVALID_INPUT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERIALIZATION_ERROR: 'SERIALIZATION_ERROR',
  
  // External Service Errors
  OPENAI_API_ERROR: 'OPENAI_API_ERROR',
  SUPABASE_ERROR: 'SUPABASE_ERROR',
  EMAIL_SERVICE_ERROR: 'EMAIL_SERVICE_ERROR',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  
  // Document Processing Errors
  DOCUMENT_NOT_FOUND: 'DOCUMENT_NOT_FOUND',
  DOCUMENT_INVALID_FORMAT: 'DOCUMENT_INVALID_FORMAT',
  DOCUMENT_TOO_LARGE: 'DOCUMENT_TOO_LARGE',
  OCR_PROCESSING_ERROR: 'OCR_PROCESSING_ERROR',
  
  // Business Logic Errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  DATA_INTEGRITY_ERROR: 'DATA_INTEGRITY_ERROR'
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Custom Error Classes for different error categories
 */
export class AlphaAgentsError extends Error {
  public readonly code: ErrorCode;
  public readonly retryable: boolean;
  public readonly details?: Record<string, any>;
  public readonly timestamp: Date;

  constructor(
    code: ErrorCode,
    message: string,
    retryable: boolean = false,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AlphaAgentsError';
    this.code = code;
    this.retryable = retryable;
    this.details = details;
    this.timestamp = new Date();
    
    // Maintains proper stack trace for V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlphaAgentsError);
    }
  }

  toAgentError(): AgentError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      stack: this.stack,
      retryable: this.retryable
    };
  }
}

export class SystemError extends AlphaAgentsError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCodes.SYSTEM_ERROR, message, false, details);
    this.name = 'SystemError';
  }
}

export class ConfigurationError extends AlphaAgentsError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCodes.CONFIGURATION_ERROR, message, false, details);
    this.name = 'ConfigurationError';
  }
}

export class ValidationError extends AlphaAgentsError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCodes.VALIDATION_ERROR, message, false, details);
    this.name = 'ValidationError';
  }
}

export class ExternalServiceError extends AlphaAgentsError {
  constructor(
    code: ErrorCode,
    message: string,
    retryable: boolean = true,
    details?: Record<string, any>
  ) {
    super(code, message, retryable, details);
    this.name = 'ExternalServiceError';
  }
}

/**
 * Global Error Handler for consistent error processing
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: ((error: AlphaAgentsError) => void)[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle and standardize errors
   */
  handleError(error: unknown, context?: Record<string, any>): AgentError {
    let agentError: AgentError;

    if (error instanceof AlphaAgentsError) {
      agentError = error.toAgentError();
    } else if (error instanceof Error) {
      agentError = {
        code: ErrorCodes.SYSTEM_ERROR,
        message: error.message,
        stack: error.stack,
        retryable: false,
        details: context
      };
    } else {
      agentError = {
        code: ErrorCodes.SYSTEM_ERROR,
        message: typeof error === 'string' ? error : 'Unknown error occurred',
        retryable: false,
        details: { originalError: error, context }
      };
    }

    // Log the error
    this.logError(agentError, context);

    // Notify error listeners
    if (error instanceof AlphaAgentsError) {
      this.notifyErrorListeners(error);
    }

    return agentError;
  }

  /**
   * Create standardized errors
   */
  createError(
    code: ErrorCode,
    message: string,
    retryable: boolean = false,
    details?: Record<string, any>
  ): AlphaAgentsError {
    return new AlphaAgentsError(code, message, retryable, details);
  }

  /**
   * Wrap external service errors
   */
  wrapExternalError(
    serviceCode: ErrorCode,
    originalError: unknown,
    retryable: boolean = true
  ): ExternalServiceError {
    const message = originalError instanceof Error 
      ? originalError.message 
      : 'External service error';
    
    return new ExternalServiceError(serviceCode, message, retryable, {
      originalError: originalError instanceof Error ? {
        name: originalError.name,
        message: originalError.message,
        stack: originalError.stack
      } : originalError
    });
  }

  /**
   * Add error listener for monitoring
   */
  addErrorListener(listener: (error: AlphaAgentsError) => void): void {
    this.errorListeners.push(listener);
  }

  /**
   * Remove error listener
   */
  removeErrorListener(listener: (error: AlphaAgentsError) => void): void {
    const index = this.errorListeners.indexOf(listener);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryable(error: AgentError): boolean {
    return error.retryable && !this.isFatalError(error.code);
  }

  /**
   * Check if error is fatal (should stop agent)
   */
  isFatalError(code: string): boolean {
    const fatalCodes = [
      ErrorCodes.CONFIGURATION_ERROR,
      ErrorCodes.AGENT_INITIALIZATION_FAILED,
      ErrorCodes.INSUFFICIENT_PERMISSIONS,
      ErrorCodes.DATA_INTEGRITY_ERROR,
      ErrorCodes.SYSTEM_ERROR,
      ErrorCodes.DEPENDENCY_ERROR
    ];
    return fatalCodes.includes(code as any);
  }

  private logError(error: AgentError, context?: Record<string, any>): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      type: 'ERROR_HANDLER',
      error: {
        code: error.code,
        message: error.message,
        retryable: error.retryable,
        details: error.details
      },
      context,
      stack: error.stack
    };

    console.error(JSON.stringify(logEntry, null, 2));
  }

  private notifyErrorListeners(error: AlphaAgentsError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });
  }
}
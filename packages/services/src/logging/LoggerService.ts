import { LogLevel } from '../../../shared/src/types/agent';


/**
 * Structured log entry interface
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  component?: string;
  agentId?: string;
  sessionId?: string;
  userId?: string;
  executionId?: string;
  data?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  performance?: {
    duration: number;
    memory?: number;
  };
  metadata?: Record<string, any>;
}

/**
 * Log context for consistent logging across components
 */
export interface LogContext {
  component?: string;
  agentId?: string;
  sessionId?: string;
  userId?: string;
  executionId?: string;
  metadata?: Record<string, any>;
  context?: string;
  operation?: string;
  documentId?: string;
  options?: any;
  filePath?: string;
  query?: string;
  executionTime?: number;
  modelName?: string;
}

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  level: LogLevel;
  format: 'json' | 'pretty';
  includeTimestamp: boolean;
  includeLevel: boolean;
  colorize: boolean;
  maxDataSize: number;
}

/**
 * Professional Logger Service for AlphaAgents
 * 
 * Provides structured logging with context awareness, performance tracking,
 * and different output formats for development and production.
 */
export class LoggerService {
  private static instance: LoggerService;
  private options: LoggerOptions;
  private context: LogContext = {};

  // Log level hierarchy for filtering
  private static readonly LOG_LEVELS = {
    [LogLevel.DEBUG]: 0,
    [LogLevel.INFO]: 1,
    [LogLevel.WARN]: 2,
    [LogLevel.ERROR]: 3,
    [LogLevel.FATAL]: 4
  };

  // ANSI color codes for pretty formatting
  private static readonly COLORS = {
    [LogLevel.DEBUG]: '\x1b[36m',   // Cyan
    [LogLevel.INFO]: '\x1b[32m',    // Green
    [LogLevel.WARN]: '\x1b[33m',    // Yellow
    [LogLevel.ERROR]: '\x1b[31m',   // Red
    [LogLevel.FATAL]: '\x1b[35m',   // Magenta
    reset: '\x1b[0m'
  };

  private constructor(options: Partial<LoggerOptions> = {}) {
    this.options = {
      level: LogLevel.INFO,
      format: 'json',
      includeTimestamp: true,
      includeLevel: true,
      colorize: process.stdout.isTTY || false,
      maxDataSize: 1000,
      ...options
    };
  }

  /**
   * Get singleton instance
   */
  static getInstance(options?: Partial<LoggerOptions>): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService(options);
    }
    return LoggerService.instance;
  }

  /**
   * Create child logger with additional context
   */
  child(context: LogContext): LoggerService {
    const childLogger = new LoggerService(this.options);
    childLogger.context = { ...this.context, ...context };
    return childLogger;
  }

  /**
   * Set logging context
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Update logger options
   */
  configure(options: Partial<LoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Debug level logging
   */
  debug(message: string, data?: any, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  /**
   * Info level logging
   */
  info(message: string, data?: any, context?: LogContext): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: any, context?: LogContext): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | any, context?: LogContext): void {
    const errorData = error instanceof Error ? {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      }
    } : { data: error };
    
    this.log(LogLevel.ERROR, message, errorData, context);
  }

  /**
   * Fatal level logging
   */
  fatal(message: string, error?: Error | any, context?: LogContext): void {
    const errorData = error instanceof Error ? {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      }
    } : { data: error };
    
    this.log(LogLevel.ERROR, message, errorData, context);
  }

  /**
   * Performance logging with timing
   */
  performance(message: string, startTime: number, data?: any, context?: LogContext): void {
    const duration = Date.now() - startTime;
    const memUsage = process.memoryUsage();
    
    this.log(LogLevel.INFO, message, {
      ...data,
      performance: {
        duration,
        memory: memUsage.heapUsed
      }
    }, context);
  }

  /**
   * Agent-specific logging
   */
  agent(agentId: string, message: string, data?: any, additionalContext?: LogContext): void {
    this.log(LogLevel.INFO, message, data, {
      ...additionalContext,
      agentId,
      component: 'agent'
    });
  }

  /**
   * System-level logging
   */
  system(message: string, data?: any, context?: LogContext): void {
    this.log(LogLevel.INFO, message, data, {
      ...context,
      component: 'system'
    });
  }

  /**
   * Security-related logging
   */
  security(message: string, data?: any, context?: LogContext): void {
    this.log(LogLevel.WARN, message, data, {
      ...context,
      component: 'security'
    });
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, data?: any, additionalContext?: LogContext): void {
    // Check if log level should be output
    if (LoggerService.LOG_LEVELS[level] < LoggerService.LOG_LEVELS[this.options.level]) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...additionalContext
    };

    // Add data if provided
    if (data !== undefined) {
      logEntry.data = this.sanitizeData(data);
    }

    // Output based on format
    if (this.options.format === 'json') {
      this.outputJson(logEntry);
    } else {
      this.outputPretty(logEntry);
    }
  }

  /**
   * Output log entry as JSON
   */
  private outputJson(entry: LogEntry): void {
    try {
      console.log(JSON.stringify(entry));
    } catch (error) {
      // Fallback if JSON serialization fails
      console.log(JSON.stringify({
        ...entry,
        data: '[Serialization Error]',
        error: error instanceof Error ? error.message : String(error)
      }));
    }
  }

  /**
   * Output log entry in pretty format
   */
  private outputPretty(entry: LogEntry): void {
    const { timestamp, level, message, component, agentId, data } = entry;
    
    const color = this.options.colorize ? LoggerService.COLORS[level] : '';
    const reset = this.options.colorize ? LoggerService.COLORS.reset : '';
    
    const timeStr = this.options.includeTimestamp ? `[${timestamp}] ` : '';
    const levelStr = this.options.includeLevel ? `${color}${level.toUpperCase()}${reset} ` : '';
    const componentStr = component ? `[${component}] ` : '';
    const agentStr = agentId ? `{${agentId}} ` : '';
    
    let output = `${timeStr}${levelStr}${componentStr}${agentStr}${message}`;
    
    if (data && Object.keys(data).length > 0) {
      output += `\n  ${JSON.stringify(data, null, 2).split('\n').join('\n  ')}`;
    }
    
    console.log(output);
  }

  /**
   * Sanitize data for logging (remove sensitive info, limit size)
   */
  private sanitizeData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    try {
      const serialized = JSON.stringify(data);
      
      // Check size limit
      if (serialized.length > this.options.maxDataSize) {
        return {
          _truncated: true,
          _originalSize: serialized.length,
          _data: serialized.substring(0, this.options.maxDataSize) + '...'
        };
      }

      // Parse back to object and sanitize sensitive fields
      const parsed = JSON.parse(serialized);
      return this.removeSensitiveFields(parsed);
      
    } catch (error) {
      return { _error: 'Data serialization failed', _type: typeof data };
    }
  }

  /**
   * Remove sensitive fields from log data
   */
  private removeSensitiveFields(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.removeSensitiveFields(item));
    }

    const sensitiveKeys = [
      'password', 'secret', 'token', 'key', 'apikey', 'api_key',
      'authorization', 'auth', 'credential', 'private'
    ];

    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        sanitized[key] = this.removeSensitiveFields(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Create execution timer
   */
  timer(name: string): () => void {
    const startTime = Date.now();
    
    return () => {
      this.performance(`Timer: ${name}`, startTime);
    };
  }

  /**
   * Log method execution with timing
   */
  async withTiming<T>(
    name: string,
    operation: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const startTime = Date.now();
    
    this.debug(`Starting: ${name}`, undefined, context);
    
    try {
      const result = await operation();
      this.performance(`Completed: ${name}`, startTime, undefined, context);
      return result;
    } catch (error) {
      this.performance(`Failed: ${name}`, startTime, { error }, context);
      throw error;
    }
  }
}
import {
  AgentStatus,
  AgentContext,
  AgentResult,
  AgentError,
  AgentConfig,
  AgentMetrics,
  HealthCheckResult,
  LogLevel
} from '../../../shared/src/types/agent';

/**
 * Abstract Base Agent Class
 * 
 * All agents in the AlphaAgents system must extend this base class.
 * Provides standardized lifecycle management, error handling, and monitoring.
 */
export abstract class BaseAgent<TInput = any, TOutput = any> {
  protected config: AgentConfig;
  protected status: AgentStatus = AgentStatus.IDLE;
  protected metrics: AgentMetrics;
  private startTime?: Date;

  constructor(config: AgentConfig) {
    this.config = config;
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTime: 0
    };
  }

  /**
   * Main execution method - implemented by each agent
   */
  abstract execute(input: TInput, context: AgentContext): Promise<AgentResult<TOutput>>;

  /**
   * Agent-specific initialization logic
   */
  protected abstract initialize(): Promise<void>;

  /**
   * Agent-specific cleanup logic
   */
  protected abstract cleanup(): Promise<void>;

  /**
   * Agent-specific health check logic
   */
  protected abstract performHealthCheck(): Promise<boolean>;

  /**
   * Public execution wrapper with error handling and metrics
   */
  public async run(input: TInput, context: AgentContext): Promise<AgentResult<TOutput>> {
    if (!this.config.enabled) {
      return this.createErrorResult(context, {
        code: 'AGENT_DISABLED',
        message: `Agent ${this.config.name} is disabled`,
        retryable: false
      });
    }

    this.status = AgentStatus.RUNNING;
    this.startTime = new Date();
    this.metrics.totalExecutions++;

    try {
      this.log(LogLevel.INFO, 'Agent execution started', { input, context });
      
      const result = await this.executeWithTimeout(input, context);
      
      if (result.success) {
        this.metrics.successfulExecutions++;
        this.log(LogLevel.INFO, 'Agent execution completed successfully', { result });
      } else {
        this.metrics.failedExecutions++;
        this.log(LogLevel.ERROR, 'Agent execution failed', { error: result.error });
      }

      this.updateExecutionTime();
      this.status = AgentStatus.IDLE;
      
      return result;

    } catch (error) {
      this.metrics.failedExecutions++;
      this.status = AgentStatus.ERROR;
      
      const agentError: AgentError = {
        code: 'EXECUTION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        retryable: true
      };

      this.log(LogLevel.ERROR, 'Agent execution threw exception', { error: agentError });
      
      return this.createErrorResult(context, agentError);
    }
  }

  /**
   * Execute with timeout protection
   */
  private async executeWithTimeout(input: TInput, context: AgentContext): Promise<AgentResult<TOutput>> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Agent execution timeout after ${this.config.timeout}ms`));
      }, this.config.timeout);

      this.execute(input, context)
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Health check implementation
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    try {
      const healthy = await this.performHealthCheck();
      
      return {
        healthy,
        status: this.status,
        message: healthy ? 'Agent is healthy' : 'Agent health check failed',
        timestamp: new Date(),
        metrics: { ...this.metrics }
      };
    } catch (error) {
      return {
        healthy: false,
        status: AgentStatus.ERROR,
        message: error instanceof Error ? error.message : 'Health check error',
        timestamp: new Date(),
        metrics: { ...this.metrics }
      };
    }
  }

  /**
   * Start agent (initialize)
   */
  public async start(): Promise<void> {
    this.log(LogLevel.INFO, 'Starting agent', { config: this.config });
    await this.initialize();
    this.status = AgentStatus.IDLE;
    this.log(LogLevel.INFO, 'Agent started successfully');
  }

  /**
   * Stop agent (cleanup)
   */
  public async stop(): Promise<void> {
    this.log(LogLevel.INFO, 'Stopping agent');
    await this.cleanup();
    this.status = AgentStatus.STOPPED;
    this.log(LogLevel.INFO, 'Agent stopped successfully');
  }

  /**
   * Get agent configuration
   */
  public getConfig(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Get agent metrics
   */
  public getMetrics(): AgentMetrics {
    return { ...this.metrics };
  }

  /**
   * Get current agent status
   */
  public getStatus(): AgentStatus {
    return this.status;
  }

  /**
   * Create standardized error result
   */
  protected createErrorResult(context: AgentContext, error: AgentError): AgentResult<TOutput> {
    return {
      success: false,
      error,
      context,
      executionTime: this.calculateExecutionTime()
    };
  }

  /**
   * Create standardized success result
   */
  protected createSuccessResult(context: AgentContext, data: TOutput): AgentResult<TOutput> {
    return {
      success: true,
      data,
      context,
      executionTime: this.calculateExecutionTime()
    };
  }

  /**
   * Structured logging
   */
  protected log(level: LogLevel, message: string, data?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      agent: this.config.name,
      agentId: this.config.id,
      message,
      data
    };

    // In production, this would integrate with a proper logging service
    console.log(JSON.stringify(logEntry, null, 2));
  }

  /**
   * Calculate execution time
   */
  private calculateExecutionTime(): number {
    return this.startTime ? Date.now() - this.startTime.getTime() : 0;
  }

  /**
   * Update average execution time metric
   */
  private updateExecutionTime(): void {
    const executionTime = this.calculateExecutionTime();
    const totalTime = this.metrics.averageExecutionTime * (this.metrics.totalExecutions - 1) + executionTime;
    this.metrics.averageExecutionTime = totalTime / this.metrics.totalExecutions;
    this.metrics.lastExecution = new Date();
  }
}
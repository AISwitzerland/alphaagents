import { BaseAgent } from '../../../core/src/agents/BaseAgent';
import { AgentContext, AgentResult, AgentConfig, AgentStatus, LogLevel } from '../../../shared/src/types/agent';
import { ErrorHandler, ErrorCodes } from '../../../core/src/errors/ErrorHandler';
import { DIContainer, ServiceTokens } from '../../../core/src/container/DIContainer';
import { LoggerService, SupabaseService } from '../../../services/src';

/**
 * Manager Agent Input/Output Types
 */
export interface ManagerAgentInput {
  command: 'healthCheck' | 'systemStatus' | 'recoverAgent' | 'shutdown';
  agentId?: string;
  parameters?: Record<string, any>;
}

export interface ManagerAgentOutput {
  status: 'success' | 'warning' | 'error';
  message: string;
  agentStates?: Record<string, AgentStatus>;
  healthReport?: HealthReport;
  recoveryAction?: string;
  systemMetrics?: SystemMetrics;
}

/**
 * Health Report Interface
 */
export interface HealthReport {
  timestamp: Date;
  overallHealth: 'healthy' | 'degraded' | 'critical';
  agentHealth: AgentHealthStatus[];
  systemMetrics: SystemMetrics;
  recommendations: string[];
}

export interface AgentHealthStatus {
  agentId: string;
  agentName: string;
  status: AgentStatus;
  healthy: boolean;
  lastHealthCheck: Date;
  metrics: {
    totalExecutions: number;
    successRate: number;
    averageExecutionTime: number;
    lastError?: string;
  };
  uptime: number;
}

export interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    percentage: number;
  };
  uptime: number;
  activeAgents: number;
  totalExecutions: number;
  errorRate: number;
}

/**
 * Manager Agent - System Orchestrator
 * 
 * The Manager Agent is responsible for:
 * - Monitoring all other agents' health and performance
 * - Automatic error recovery and system healing
 * - System-wide metrics collection and reporting
 * - Coordinating agent lifecycle and dependencies
 * - Escalating critical issues to human operators
 */
export class ManagerAgent extends BaseAgent<ManagerAgentInput, ManagerAgentOutput> {
  private container: DIContainer;
  private logger: LoggerService;
  private supabase: SupabaseService;
  private errorHandler: ErrorHandler;
  private registeredAgents: Map<string, BaseAgent> = new Map();
  private healthCheckIntervals: Map<string, NodeJS.Timeout> = new Map();
  private systemStartTime: Date = new Date();

  constructor(config: AgentConfig, container: DIContainer) {
    super(config);
    this.container = container;
    this.errorHandler = ErrorHandler.getInstance();
  }

  async execute(input: ManagerAgentInput, context: AgentContext): Promise<AgentResult<ManagerAgentOutput>> {
    this.log(LogLevel.INFO, `Manager executing command: ${input.command}`, { input, context });

    try {
      switch (input.command) {
        case 'healthCheck':
          return await this.performSystemHealthCheck(context);
        
        case 'systemStatus':
          return await this.getSystemStatus(context);
        
        case 'recoverAgent':
          if (!input.agentId) {
            throw this.errorHandler.createError(
              ErrorCodes.INVALID_INPUT,
              'Agent ID required for recovery operation'
            );
          }
          return await this.recoverAgent(input.agentId, context);
        
        case 'shutdown':
          return await this.performGracefulShutdown(context);
        
        default:
          throw this.errorHandler.createError(
            ErrorCodes.INVALID_INPUT,
            `Unknown command: ${input.command}`
          );
      }
    } catch (error) {
      this.log(LogLevel.ERROR, 'Manager command execution failed', { error, input });
      
      const agentError = this.errorHandler.handleError(error, { 
        command: input.command,
        agentId: input.agentId 
      });
      
      return this.createErrorResult(context, agentError);
    }
  }

  protected async initialize(): Promise<void> {
    this.log(LogLevel.INFO, 'Initializing Manager Agent...');

    try {
      // Resolve dependencies
      this.logger = await this.container.resolve<LoggerService>(ServiceTokens.LOGGER);
      this.supabase = await this.container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);

      // Setup error listener for system-wide error monitoring
      this.errorHandler.addErrorListener(this.handleSystemError.bind(this));

      this.log(LogLevel.INFO, 'Manager Agent initialized successfully');
    } catch (error) {
      this.log(LogLevel.FATAL, 'Manager Agent initialization failed', { error });
      throw error;
    }
  }

  protected async cleanup(): Promise<void> {
    this.log(LogLevel.INFO, 'Cleaning up Manager Agent...');

    try {
      // Clear all health check intervals
      this.healthCheckIntervals.forEach(interval => clearInterval(interval));
      this.healthCheckIntervals.clear();

      // Remove error listener
      this.errorHandler.removeErrorListener(this.handleSystemError.bind(this));

      this.log(LogLevel.INFO, 'Manager Agent cleanup completed');
    } catch (error) {
      this.log(LogLevel.ERROR, 'Manager Agent cleanup failed', { error });
    }
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      // Check if dependencies are available
      if (!this.logger || !this.supabase) {
        return false;
      }

      // Test database connection
      const dbHealthy = await this.supabase.testConnection();
      
      // Check registered agents count
      const hasAgents = this.registeredAgents.size > 0;

      return dbHealthy && hasAgents;
    } catch (error) {
      this.log(LogLevel.ERROR, 'Manager health check failed', { error });
      return false;
    }
  }

  // === AGENT REGISTRY MANAGEMENT ===

  /**
   * Register an agent for monitoring
   */
  registerAgent(agentId: string, agent: BaseAgent): void {
    this.log(LogLevel.INFO, `Registering agent for monitoring: ${agentId}`);
    
    this.registeredAgents.set(agentId, agent);
    
    // Start health check monitoring for this agent
    this.startAgentMonitoring(agentId, agent);
  }

  /**
   * Unregister an agent from monitoring
   */
  unregisterAgent(agentId: string): void {
    this.log(LogLevel.INFO, `Unregistering agent: ${agentId}`);
    
    // Clear health check interval
    const interval = this.healthCheckIntervals.get(agentId);
    if (interval) {
      clearInterval(interval);
      this.healthCheckIntervals.delete(agentId);
    }
    
    this.registeredAgents.delete(agentId);
  }

  /**
   * Start monitoring an agent
   */
  private startAgentMonitoring(agentId: string, agent: BaseAgent): void {
    const config = agent.getConfig();
    const checkInterval = config.healthCheckInterval;

    const interval = setInterval(async () => {
      try {
        const healthResult = await agent.healthCheck();
        
        // Log health check to database
        await this.supabase.logHealthCheck({
          agent_id: agentId,
          agent_name: config.name,
          healthy: healthResult.healthy,
          status: healthResult.status,
          message: healthResult.message,
          metrics: healthResult.metrics
        });

        // Attempt automatic recovery if unhealthy
        if (!healthResult.healthy) {
          this.log(LogLevel.WARN, `Agent ${agentId} is unhealthy, attempting recovery`, healthResult);
          await this.attemptAutomaticRecovery(agentId, agent);
        }
      } catch (error) {
        this.log(LogLevel.ERROR, `Health check failed for agent ${agentId}`, { error });
      }
    }, checkInterval);

    this.healthCheckIntervals.set(agentId, interval);
  }

  // === HEALTH CHECK OPERATIONS ===

  /**
   * Perform comprehensive system health check
   */
  private async performSystemHealthCheck(context: AgentContext): Promise<AgentResult<ManagerAgentOutput>> {
    const startTime = Date.now();
    
    this.log(LogLevel.INFO, 'Performing system health check');

    try {
      const agentHealthStatuses: AgentHealthStatus[] = [];
      
      // Check each registered agent
      for (const [agentId, agent] of this.registeredAgents) {
        try {
          const healthResult = await agent.healthCheck();
          const metrics = agent.getMetrics();
          
          const agentHealth: AgentHealthStatus = {
            agentId,
            agentName: agent.getConfig().name,
            status: healthResult.status,
            healthy: healthResult.healthy,
            lastHealthCheck: healthResult.timestamp,
            metrics: {
              totalExecutions: metrics.totalExecutions,
              successRate: metrics.totalExecutions > 0 
                ? (metrics.successfulExecutions / metrics.totalExecutions) * 100 
                : 100,
              averageExecutionTime: metrics.averageExecutionTime,
              lastError: metrics.lastError?.message
            },
            uptime: Date.now() - this.systemStartTime.getTime()
          };
          
          agentHealthStatuses.push(agentHealth);
        } catch (error) {
          this.log(LogLevel.ERROR, `Failed to check health of agent ${agentId}`, { error });
        }
      }

      // Calculate overall system health
      const healthyAgents = agentHealthStatuses.filter(a => a.healthy).length;
      const totalAgents = agentHealthStatuses.length;
      
      let overallHealth: 'healthy' | 'degraded' | 'critical';
      if (healthyAgents === totalAgents) {
        overallHealth = 'healthy';
      } else if (healthyAgents >= totalAgents * 0.7) {
        overallHealth = 'degraded';
      } else {
        overallHealth = 'critical';
      }

      // Get system metrics
      const systemMetrics = this.getSystemMetrics();

      // Generate recommendations
      const recommendations = this.generateRecommendations(agentHealthStatuses, systemMetrics);

      const healthReport: HealthReport = {
        timestamp: new Date(),
        overallHealth,
        agentHealth: agentHealthStatuses,
        systemMetrics,
        recommendations
      };

      const executionTime = Date.now() - startTime;
      
      this.log(LogLevel.INFO, 'System health check completed', {
        overallHealth,
        healthyAgents,
        totalAgents,
        executionTime
      });

      return this.createSuccessResult(context, {
        status: 'success',
        message: `System health: ${overallHealth}. ${healthyAgents}/${totalAgents} agents healthy.`,
        healthReport
      });
    } catch (error) {
      const agentError = this.errorHandler.handleError(error);
      return this.createErrorResult(context, agentError);
    }
  }

  /**
   * Get current system status
   */
  private async getSystemStatus(context: AgentContext): Promise<AgentResult<ManagerAgentOutput>> {
    try {
      const agentStates: Record<string, AgentStatus> = {};
      
      for (const [agentId, agent] of this.registeredAgents) {
        agentStates[agentId] = agent.getStatus();
      }

      const systemMetrics = this.getSystemMetrics();

      return this.createSuccessResult(context, {
        status: 'success',
        message: `System running with ${this.registeredAgents.size} registered agents`,
        agentStates,
        systemMetrics
      });
    } catch (error) {
      const agentError = this.errorHandler.handleError(error);
      return this.createErrorResult(context, agentError);
    }
  }

  // === RECOVERY OPERATIONS ===

  /**
   * Attempt automatic recovery of an agent
   */
  private async attemptAutomaticRecovery(agentId: string, agent: BaseAgent): Promise<void> {
    this.log(LogLevel.INFO, `Attempting automatic recovery for agent: ${agentId}`);

    try {
      // Strategy 1: Restart the agent
      await agent.stop();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
      await agent.start();

      // Verify recovery
      const healthCheck = await agent.healthCheck();
      
      if (healthCheck.healthy) {
        this.log(LogLevel.INFO, `Agent ${agentId} recovered successfully`);
        
        // Send notification about successful recovery
        await this.sendNotification({
          type: 'recovery_success',
          agentId,
          message: `Agent ${agentId} was automatically recovered`
        });
      } else {
        this.log(LogLevel.WARN, `Agent ${agentId} recovery failed, escalating to manual intervention`);
        await this.escalateToHuman(agentId, 'Automatic recovery failed');
      }
    } catch (error) {
      this.log(LogLevel.ERROR, `Recovery attempt failed for agent ${agentId}`, { error });
      await this.escalateToHuman(agentId, `Recovery error: ${error}`);
    }
  }

  /**
   * Manual agent recovery
   */
  private async recoverAgent(agentId: string, context: AgentContext): Promise<AgentResult<ManagerAgentOutput>> {
    this.log(LogLevel.INFO, `Manual recovery requested for agent: ${agentId}`);

    const agent = this.registeredAgents.get(agentId);
    if (!agent) {
      throw this.errorHandler.createError(
        ErrorCodes.AGENT_NOT_FOUND,
        `Agent ${agentId} not found in registry`
      );
    }

    try {
      await this.attemptAutomaticRecovery(agentId, agent);

      return this.createSuccessResult(context, {
        status: 'success',
        message: `Recovery completed for agent ${agentId}`,
        recoveryAction: 'restart'
      });
    } catch (error) {
      const agentError = this.errorHandler.handleError(error);
      return this.createErrorResult(context, agentError);
    }
  }

  // === SYSTEM OPERATIONS ===

  /**
   * Perform graceful system shutdown
   */
  private async performGracefulShutdown(context: AgentContext): Promise<AgentResult<ManagerAgentOutput>> {
    this.log(LogLevel.INFO, 'Initiating graceful system shutdown');

    try {
      // Stop all registered agents
      for (const [agentId, agent] of this.registeredAgents) {
        try {
          this.log(LogLevel.INFO, `Stopping agent: ${agentId}`);
          await agent.stop();
        } catch (error) {
          this.log(LogLevel.WARN, `Failed to stop agent ${agentId}`, { error });
        }
      }

      // Clear all monitoring intervals
      this.healthCheckIntervals.forEach(interval => clearInterval(interval));
      this.healthCheckIntervals.clear();

      this.log(LogLevel.INFO, 'Graceful shutdown completed');

      return this.createSuccessResult(context, {
        status: 'success',
        message: 'System shutdown completed successfully'
      });
    } catch (error) {
      const agentError = this.errorHandler.handleError(error);
      return this.createErrorResult(context, agentError);
    }
  }

  // === UTILITY METHODS ===

  /**
   * Handle system-wide errors
   */
  private handleSystemError(error: any): void {
    this.log(LogLevel.ERROR, 'System-wide error detected', { error });
    
    // Log critical errors to database for analysis
    if (this.errorHandler.isFatalError(error.code)) {
      this.escalateToHuman('system', `Fatal error: ${error.message}`);
    }
  }

  /**
   * Get current system metrics
   */
  private getSystemMetrics(): SystemMetrics {
    const memUsage = process.memoryUsage();
    
    // Calculate total executions across all agents
    let totalExecutions = 0;
    let totalErrors = 0;
    
    for (const agent of this.registeredAgents.values()) {
      const metrics = agent.getMetrics();
      totalExecutions += metrics.totalExecutions;
      totalErrors += metrics.failedExecutions;
    }

    return {
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
      },
      cpu: {
        percentage: 0 // Would need additional library for accurate CPU monitoring
      },
      uptime: Date.now() - this.systemStartTime.getTime(),
      activeAgents: this.registeredAgents.size,
      totalExecutions,
      errorRate: totalExecutions > 0 ? (totalErrors / totalExecutions) * 100 : 0
    };
  }

  /**
   * Generate system recommendations
   */
  private generateRecommendations(agentHealth: AgentHealthStatus[], systemMetrics: SystemMetrics): string[] {
    const recommendations: string[] = [];

    // Memory recommendations
    if (systemMetrics.memory.percentage > 80) {
      recommendations.push('High memory usage detected. Consider restarting agents or scaling resources.');
    }

    // Error rate recommendations
    if (systemMetrics.errorRate > 10) {
      recommendations.push('High error rate detected. Review agent configurations and error logs.');
    }

    // Agent-specific recommendations
    const unhealthyAgents = agentHealth.filter(a => !a.healthy);
    if (unhealthyAgents.length > 0) {
      recommendations.push(`${unhealthyAgents.length} agents are unhealthy. Consider manual intervention.`);
    }

    // Performance recommendations
    const slowAgents = agentHealth.filter(a => a.metrics.averageExecutionTime > 10000);
    if (slowAgents.length > 0) {
      recommendations.push('Some agents have slow execution times. Review performance bottlenecks.');
    }

    return recommendations;
  }

  /**
   * Send system notification
   */
  private async sendNotification(notification: {
    type: string;
    agentId: string;
    message: string;
  }): Promise<void> {
    // In production, this would integrate with notification services
    this.log(LogLevel.INFO, 'System notification', notification);
  }

  /**
   * Escalate issues to human operators
   */
  private async escalateToHuman(agentId: string, reason: string): Promise<void> {
    this.log(LogLevel.WARN, `Escalating to human intervention`, { agentId, reason });
    
    // In production, this would:
    // - Send email/SMS alerts
    // - Create support tickets
    // - Log to incident management system
    
    await this.sendNotification({
      type: 'escalation',
      agentId,
      message: `Manual intervention required: ${reason}`
    });
  }
}
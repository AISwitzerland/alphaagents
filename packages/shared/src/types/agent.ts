/**
 * Core Agent Types for AlphaAgents System
 * 
 * Defines the foundational interfaces and types for all agents
 * in the AlphaAgents document processing platform.
 */

export enum AgentStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  ERROR = 'error',
  STOPPED = 'stopped'
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface AgentContext {
  agentId: string;
  sessionId: string;
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentResult<T = any> {
  success: boolean;
  data?: T;
  error?: AgentError;
  context: AgentContext;
  executionTime: number;
}

export interface AgentError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
  retryable: boolean;
}

export interface AgentConfig {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  maxRetries: number;
  timeout: number;
  dependencies: string[];
  healthCheckInterval: number;
}

export interface AgentMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecution?: Date;
  lastError?: AgentError;
}

export interface HealthCheckResult {
  healthy: boolean;
  status: AgentStatus;
  message?: string;
  timestamp: Date;
  metrics: AgentMetrics;
}
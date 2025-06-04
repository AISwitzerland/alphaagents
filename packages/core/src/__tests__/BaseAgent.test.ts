import { BaseAgent } from '../agents/BaseAgent';
import { AgentStatus, AgentContext, AgentResult, AgentConfig } from '@alpha-agents/shared/types/agent';

/**
 * Test Implementation of BaseAgent for testing purposes
 */
class TestAgent extends BaseAgent<string, string> {
  private initializeCalled = false;
  private cleanupCalled = false;
  private shouldFailHealthCheck = false;
  private shouldFailExecution = false;
  private executionDelay = 0;

  async execute(input: string, context: AgentContext): Promise<AgentResult<string>> {
    if (this.shouldFailExecution) {
      throw new Error('Simulated execution failure');
    }

    if (this.executionDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.executionDelay));
    }

    return this.createSuccessResult(context, `Processed: ${input}`);
  }

  protected async initialize(): Promise<void> {
    this.initializeCalled = true;
  }

  protected async cleanup(): Promise<void> {
    this.cleanupCalled = true;
  }

  protected async performHealthCheck(): Promise<boolean> {
    return !this.shouldFailHealthCheck;
  }

  // Test helpers
  setFailHealthCheck(fail: boolean): void {
    this.shouldFailHealthCheck = fail;
  }

  setFailExecution(fail: boolean): void {
    this.shouldFailExecution = fail;
  }

  setExecutionDelay(delay: number): void {
    this.executionDelay = delay;
  }

  wasInitializeCalled(): boolean {
    return this.initializeCalled;
  }

  wasCleanupCalled(): boolean {
    return this.cleanupCalled;
  }
}

describe('BaseAgent', () => {
  let testAgent: TestAgent;
  let agentConfig: AgentConfig;
  let testContext: AgentContext;

  beforeEach(() => {
    agentConfig = {
      id: 'test-agent-001',
      name: 'TestAgent',
      version: '1.0.0',
      enabled: true,
      maxRetries: 3,
      timeout: 5000,
      dependencies: [],
      healthCheckInterval: 30000
    };

    testContext = {
      agentId: 'test-agent-001',
      sessionId: 'test-session-001',
      userId: 'test-user-001',
      timestamp: new Date(),
      metadata: { source: 'test' }
    };

    testAgent = new TestAgent(agentConfig);
  });

  describe('Initialization and Lifecycle', () => {
    test('should initialize agent successfully', async () => {
      await testAgent.start();
      
      expect(testAgent.wasInitializeCalled()).toBe(true);
      expect(testAgent.getStatus()).toBe(AgentStatus.IDLE);
    });

    test('should cleanup agent successfully', async () => {
      await testAgent.start();
      await testAgent.stop();
      
      expect(testAgent.wasCleanupCalled()).toBe(true);
      expect(testAgent.getStatus()).toBe(AgentStatus.STOPPED);
    });

    test('should return correct configuration', () => {
      const config = testAgent.getConfig();
      
      expect(config).toEqual(agentConfig);
      expect(config).not.toBe(agentConfig); // Should be a copy
    });
  });

  describe('Agent Execution', () => {
    beforeEach(async () => {
      await testAgent.start();
    });

    test('should execute successfully with valid input', async () => {
      const result = await testAgent.run('test input', testContext);
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('Processed: test input');
      expect(result.context).toEqual(testContext);
      expect(result.executionTime).toBeGreaterThan(0);
      expect(result.error).toBeUndefined();
    });

    test('should handle execution errors gracefully', async () => {
      testAgent.setFailExecution(true);
      
      const result = await testAgent.run('test input', testContext);
      
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('EXECUTION_ERROR');
      expect(result.error?.message).toBe('Simulated execution failure');
      expect(result.error?.retryable).toBe(true);
    });

    test('should respect timeout configuration', async () => {
      testAgent.setExecutionDelay(6000); // Longer than 5000ms timeout
      
      const result = await testAgent.run('test input', testContext);
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('timeout');
    });

    test('should reject execution when agent is disabled', async () => {
      const disabledConfig = { ...agentConfig, enabled: false };
      const disabledAgent = new TestAgent(disabledConfig);
      
      const result = await disabledAgent.run('test input', testContext);
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('AGENT_DISABLED');
      expect(result.error?.retryable).toBe(false);
    });
  });

  describe('Health Checks', () => {
    beforeEach(async () => {
      await testAgent.start();
    });

    test('should perform successful health check', async () => {
      const healthResult = await testAgent.healthCheck();
      
      expect(healthResult.healthy).toBe(true);
      expect(healthResult.status).toBe(AgentStatus.IDLE);
      expect(healthResult.message).toBe('Agent is healthy');
      expect(healthResult.timestamp).toBeInstanceOf(Date);
      expect(healthResult.metrics).toBeDefined();
    });

    test('should handle failed health check', async () => {
      testAgent.setFailHealthCheck(true);
      
      const healthResult = await testAgent.healthCheck();
      
      expect(healthResult.healthy).toBe(false);
      expect(healthResult.message).toBe('Agent health check failed');
    });

    test('should handle health check exceptions', async () => {
      // Simulate health check throwing an error
      jest.spyOn(testAgent as any, 'performHealthCheck').mockRejectedValue(new Error('Health check error'));
      
      const healthResult = await testAgent.healthCheck();
      
      expect(healthResult.healthy).toBe(false);
      expect(healthResult.status).toBe(AgentStatus.ERROR);
      expect(healthResult.message).toBe('Health check error');
    });
  });

  describe('Metrics Tracking', () => {
    beforeEach(async () => {
      await testAgent.start();
    });

    test('should track execution metrics correctly', async () => {
      // Execute multiple times
      await testAgent.run('input1', testContext);
      await testAgent.run('input2', testContext);
      testAgent.setFailExecution(true);
      await testAgent.run('input3', testContext);
      
      const metrics = testAgent.getMetrics();
      
      expect(metrics.totalExecutions).toBe(3);
      expect(metrics.successfulExecutions).toBe(2);
      expect(metrics.failedExecutions).toBe(1);
      expect(metrics.averageExecutionTime).toBeGreaterThan(0);
      expect(metrics.lastExecution).toBeInstanceOf(Date);
    });

    test('should calculate average execution time correctly', async () => {
      const metrics1 = testAgent.getMetrics();
      expect(metrics1.averageExecutionTime).toBe(0);
      
      await testAgent.run('input1', testContext);
      const metrics2 = testAgent.getMetrics();
      expect(metrics2.averageExecutionTime).toBeGreaterThan(0);
      
      await testAgent.run('input2', testContext);
      const metrics3 = testAgent.getMetrics();
      expect(metrics3.totalExecutions).toBe(2);
      expect(metrics3.averageExecutionTime).toBeGreaterThan(0);
    });
  });

  describe('Status Management', () => {
    test('should manage status transitions correctly', async () => {
      // Initial status
      expect(testAgent.getStatus()).toBe(AgentStatus.IDLE);
      
      // Start agent
      await testAgent.start();
      expect(testAgent.getStatus()).toBe(AgentStatus.IDLE);
      
      // During execution (we can't easily test RUNNING status due to async nature)
      
      // After execution failure
      testAgent.setFailExecution(true);
      await testAgent.run('input', testContext);
      expect(testAgent.getStatus()).toBe(AgentStatus.ERROR);
      
      // Stop agent
      await testAgent.stop();
      expect(testAgent.getStatus()).toBe(AgentStatus.STOPPED);
    });
  });

  describe('Error Result Creation', () => {
    test('should create proper error results', async () => {
      testAgent.setFailExecution(true);
      
      const result = await testAgent.run('test input', testContext);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('EXECUTION_ERROR');
      expect(result.error?.retryable).toBe(true);
      expect(result.context).toEqual(testContext);
      expect(result.executionTime).toBeGreaterThan(0);
    });
  });
});
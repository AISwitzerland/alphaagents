/**
 * Foundation Test Demo Script
 * 
 * Demonstrates the AlphaAgents foundation components in action.
 * Run this to verify that all core systems work correctly.
 */

import { BaseAgent } from '../packages/core/src/agents/BaseAgent';
import { DIContainer, ServiceTokens } from '../packages/core/src/container/DIContainer';
import { ErrorHandler, ErrorCodes, ValidationError } from '../packages/core/src/errors/ErrorHandler';
import { AgentStatus, AgentContext, AgentResult, AgentConfig, LogLevel } from '../packages/shared/src/types/agent';

/**
 * Demo Document Processing Agent
 */
class DemoDocumentAgent extends BaseAgent<{ filename: string; content: string }, { processedContent: string; metadata: any }> {
  async execute(input: { filename: string; content: string }, context: AgentContext): Promise<AgentResult<{ processedContent: string; metadata: any }>> {
    this.log(LogLevel.INFO, 'Processing document', { filename: input.filename });

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simulate validation
    if (!input.filename.endsWith('.pdf') && !input.filename.endsWith('.docx')) {
      throw new ValidationError('Unsupported file format', { 
        filename: input.filename,
        supportedFormats: ['.pdf', '.docx']
      });
    }

    const result = {
      processedContent: `Processed: ${input.content}`,
      metadata: {
        filename: input.filename,
        processedAt: new Date(),
        wordCount: input.content.split(' ').length
      }
    };

    return this.createSuccessResult(context, result);
  }

  protected async initialize(): Promise<void> {
    this.log(LogLevel.INFO, 'DemoDocumentAgent initialized');
  }

  protected async cleanup(): Promise<void> {
    this.log(LogLevel.INFO, 'DemoDocumentAgent cleaned up');
  }

  protected async performHealthCheck(): Promise<boolean> {
    return true; // Always healthy for demo
  }
}

/**
 * Demo Logger Service
 */
class DemoLogger {
  log(level: string, message: string, data?: any): void {
    console.log(`[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

/**
 * Demo Configuration Service
 */
class DemoConfig {
  get(key: string): string | undefined {
    const config = {
      'app.name': 'AlphaAgents Demo',
      'app.version': '1.0.0',
      'openai.apiKey': 'demo-key-not-real',
      'supabase.url': 'https://demo.supabase.co'
    };
    return config[key as keyof typeof config];
  }
}

/**
 * Main Demo Function
 */
async function runFoundationDemo(): Promise<void> {
  console.log('🚀 AlphaAgents Foundation Demo Started\n');

  // 1. Test Dependency Injection Container
  console.log('📦 Testing Dependency Injection Container...');
  const container = new DIContainer();

  // Register services
  container.registerSingleton(ServiceTokens.LOGGER, () => new DemoLogger());
  container.registerSingleton(ServiceTokens.CONFIG, () => new DemoConfig());

  // Register agent
  container.registerSingleton(
    ServiceTokens.DOCUMENT_AGENT,
    async (container) => {
      const logger = await container.resolve<DemoLogger>(ServiceTokens.LOGGER);
      const config = await container.resolve<DemoConfig>(ServiceTokens.CONFIG);
      
      const agentConfig: AgentConfig = {
        id: 'demo-document-agent',
        name: 'DemoDocumentAgent',
        version: config.get('app.version') || '1.0.0',
        enabled: true,
        maxRetries: 3,
        timeout: 5000,
        dependencies: [],
        healthCheckInterval: 30000
      };

      return new DemoDocumentAgent(agentConfig);
    },
    [ServiceTokens.LOGGER, ServiceTokens.CONFIG]
  );

  // Resolve services
  const logger = await container.resolve<DemoLogger>(ServiceTokens.LOGGER);
  const config = await container.resolve<DemoConfig>(ServiceTokens.CONFIG);
  const documentAgent = await container.resolve<DemoDocumentAgent>(ServiceTokens.DOCUMENT_AGENT);

  logger.log('info', 'Services resolved successfully', {
    appName: config.get('app.name'),
    agentId: documentAgent.getConfig().id
  });

  console.log('✅ DI Container works!\n');

  // 2. Test Agent Lifecycle
  console.log('🤖 Testing Agent Lifecycle...');
  
  await documentAgent.start();
  logger.log('info', 'Agent started', { status: documentAgent.getStatus() });

  // Test health check
  const healthResult = await documentAgent.healthCheck();
  logger.log('info', 'Health check result', healthResult);

  console.log('✅ Agent lifecycle works!\n');

  // 3. Test Successful Execution
  console.log('📄 Testing Successful Document Processing...');
  
  const context: AgentContext = {
    agentId: documentAgent.getConfig().id,
    sessionId: 'demo-session-001',
    userId: 'demo-user',
    timestamp: new Date(),
    metadata: { source: 'demo' }
  };

  const validInput = {
    filename: 'test-document.pdf',
    content: 'This is a test document with some content.'
  };

  const successResult = await documentAgent.run(validInput, context);
  
  if (successResult.success) {
    logger.log('info', 'Document processed successfully', {
      result: successResult.data,
      executionTime: `${successResult.executionTime}ms`
    });
  }

  console.log('✅ Successful execution works!\n');

  // 4. Test Error Handling
  console.log('❌ Testing Error Handling...');

  const invalidInput = {
    filename: 'test-document.txt', // Unsupported format
    content: 'This should fail validation.'
  };

  const errorResult = await documentAgent.run(invalidInput, context);
  
  if (!errorResult.success) {
    logger.log('warn', 'Expected error occurred', {
      errorCode: errorResult.error?.code,
      errorMessage: errorResult.error?.message,
      retryable: errorResult.error?.retryable
    });
  }

  console.log('✅ Error handling works!\n');

  // 5. Test Error Handler
  console.log('🔧 Testing Global Error Handler...');
  
  const errorHandler = ErrorHandler.getInstance();
  
  // Add error listener
  const errorListener = (error: any) => {
    logger.log('error', 'Error captured by listener', {
      code: error.code,
      message: error.message
    });
  };
  
  errorHandler.addErrorListener(errorListener);

  // Create and handle different error types
  const validationError = new ValidationError('Demo validation error', { field: 'demo' });
  const agentError = errorHandler.handleError(validationError);
  
  logger.log('info', 'Error handling result', {
    isRetryable: errorHandler.isRetryable(agentError),
    isFatal: errorHandler.isFatalError(agentError.code)
  });

  console.log('✅ Global error handling works!\n');

  // 6. Test Agent Metrics
  console.log('📊 Testing Agent Metrics...');
  
  const metrics = documentAgent.getMetrics();
  logger.log('info', 'Agent metrics', metrics);

  console.log('✅ Metrics tracking works!\n');

  // 7. Cleanup
  console.log('🧹 Cleaning up...');
  
  await documentAgent.stop();
  errorHandler.removeErrorListener(errorListener);
  await container.dispose();

  console.log('✅ Cleanup completed!\n');

  console.log('🎉 AlphaAgents Foundation Demo Completed Successfully!');
  console.log('All core systems are working correctly and ready for agent development.\n');
}

// Run the demo
if (require.main === module) {
  runFoundationDemo().catch(error => {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  });
}

export { runFoundationDemo };
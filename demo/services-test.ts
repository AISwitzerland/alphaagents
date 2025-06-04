/**
 * Services Test Demo Script
 * 
 * Demonstrates the AlphaAgents core services integration.
 * Tests configuration, logging, and service bootstrapping.
 */

import { ServiceRegistry } from '../packages/core/src/services/ServiceRegistry';
import { ConfigService, LoggerService } from '../packages/services/src';
import { ServiceTokens } from '../packages/core/src/container/DIContainer';

/**
 * Demo environment setup
 */
function setupDemoEnvironment(): void {
  // Set required environment variables for demo
  process.env.OPENAI_API_KEY = 'demo-key-sk-1234567890abcdef';
  process.env.SUPABASE_URL = 'https://demo-project.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'demo-anon-key-1234567890';
  process.env.NODE_ENV = 'development';
  process.env.LOG_LEVEL = 'info';
  process.env.LOG_FORMAT = 'pretty';
}

/**
 * Main demo function
 */
async function runServicesDemo(): Promise<void> {
  console.log('🚀 AlphaAgents Core Services Demo Started\n');

  // Setup demo environment
  setupDemoEnvironment();

  try {
    // 1. Test Configuration Service
    console.log('⚙️ Testing Configuration Service...');
    
    const config = ConfigService.getInstance();
    
    console.log('✅ Configuration loaded:');
    console.log(`  - App Name: ${config.get('APP_NAME')}`);
    console.log(`  - Environment: ${config.get('NODE_ENV')}`);
    console.log(`  - Default Language: ${config.get('DEFAULT_LANGUAGE')}`);
    console.log(`  - Supported Languages: ${config.getSupportedLanguages().join(', ')}`);
    console.log(`  - OpenAI Model: ${config.getOpenAIConfig().defaultModel}`);
    console.log(`  - Vision Model: ${config.getOpenAIConfig().visionModel}`);
    console.log(`  - Agent Timeout: ${config.getAgentDefaults().timeout}ms\n`);

    // 2. Test Logger Service
    console.log('📝 Testing Logger Service...');
    
    const logger = LoggerService.getInstance({
      level: config.get('LOG_LEVEL') as any,
      format: config.get('LOG_FORMAT') as any,
      colorize: true
    });

    logger.info('Logger service initialized successfully');
    logger.debug('This is a debug message (might not show depending on level)');
    logger.warn('This is a warning message');
    
    // Test child logger with context
    const agentLogger = logger.child({
      component: 'demo-agent',
      agentId: 'demo-001'
    });
    
    agentLogger.info('Child logger with context working');
    
    // Test performance logging
    const timer = logger.timer('demo-operation');
    await new Promise(resolve => setTimeout(resolve, 100));
    timer();
    
    // Test error logging
    try {
      throw new Error('Demo error for testing');
    } catch (error) {
      logger.error('Caught demo error', error);
    }
    
    console.log('✅ Logger service working correctly\n');

    // 3. Test Service Registry
    console.log('🔧 Testing Service Registry...');
    
    const serviceRegistry = ServiceRegistry.getInstance();
    
    console.log('Registering core services...');
    await serviceRegistry.registerCoreServices();
    
    const container = serviceRegistry.getContainer();
    
    // Test service resolution
    const resolvedConfig = await container.resolve<ConfigService>(ServiceTokens.CONFIG);
    const resolvedLogger = await container.resolve<LoggerService>(ServiceTokens.LOGGER);
    
    console.log('✅ Services registered and resolved successfully');
    console.log(`  - Config Service: ${resolvedConfig.get('APP_NAME')}`);
    console.log(`  - Logger available: ${!!resolvedLogger}`);
    
    // Test synchronous resolution after async
    const syncConfig = container.resolveSync<ConfigService>(ServiceTokens.CONFIG);
    console.log(`  - Sync resolution works: ${syncConfig.get('APP_VERSION')}\n`);

    // 4. Test Agent Configuration Creation
    console.log('🤖 Testing Agent Configuration Creation...');
    
    const agentConfig = resolvedConfig.createAgentConfig({
      id: 'demo-document-agent',
      name: 'DemoDocumentAgent',
      timeout: 10000,
      maxRetries: 5
    });
    
    console.log('✅ Agent configuration created:');
    console.log(`  - ID: ${agentConfig.id}`);
    console.log(`  - Name: ${agentConfig.name}`);
    console.log(`  - Version: ${agentConfig.version}`);
    console.log(`  - Timeout: ${agentConfig.timeout}ms`);
    console.log(`  - Max Retries: ${agentConfig.maxRetries}`);
    console.log(`  - Health Check Interval: ${agentConfig.healthCheckInterval}ms\n`);

    // 5. Test Feature Validation
    console.log('🔍 Testing Feature Validation...');
    
    try {
      resolvedConfig.validateFeatureConfig('openai');
      console.log('✅ OpenAI configuration is valid');
    } catch (error) {
      console.log('⚠️ OpenAI configuration validation failed:', (error as Error).message);
    }
    
    try {
      resolvedConfig.validateFeatureConfig('supabase');
      console.log('✅ Supabase configuration is valid');
    } catch (error) {
      console.log('⚠️ Supabase configuration validation failed:', (error as Error).message);
    }
    
    try {
      resolvedConfig.validateFeatureConfig('email');
      console.log('✅ Email configuration is valid');
    } catch (error) {
      console.log('⚠️ Email configuration not configured (optional)');
    }
    
    console.log();

    // 6. Test Logger Performance and Context Features
    console.log('📊 Testing Advanced Logger Features...');
    
    // Test withTiming
    const result = await resolvedLogger.withTiming(
      'demo-async-operation',
      async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return 'operation completed';
      },
{}
    );
    
    console.log(`✅ Timed operation result: ${result}`);
    
    // Test different log levels
    resolvedLogger.debug('Debug message with data', { debugInfo: 'test' });
    resolvedLogger.info('Info message', { info: 'important' });
    resolvedLogger.warn('Warning message', { warning: 'careful' });
    
    // Test agent-specific logging
    resolvedLogger.agent('test-agent-001', 'Agent started successfully', {
      version: '1.0.0',
      config: { enabled: true }
    });
    
    resolvedLogger.system('System status check', {
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
    
    console.log('✅ Advanced logger features working\n');

    // 7. Test Service Registry Lifecycle
    console.log('♻️ Testing Service Lifecycle...');
    
    console.log('Services registered:', container.getRegisteredServices().length);
    
    // Test graceful shutdown
    console.log('Initiating graceful shutdown...');
    await serviceRegistry.shutdown();
    
    console.log('✅ Graceful shutdown completed\n');

    console.log('🎉 AlphaAgents Core Services Demo Completed Successfully!');
    console.log('All core services are working correctly and ready for agent development.\n');

  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
if (require.main === module) {
  runServicesDemo().catch(error => {
    console.error('❌ Services demo failed:', error);
    process.exit(1);
  });
}

export { runServicesDemo };
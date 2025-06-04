import { DIContainer, ServiceTokens } from '../container/DIContainer';
import { ConfigService, LoggerService, SupabaseService, OpenAIService } from '../../../services/src';

/**
 * Service Registry for AlphaAgents
 * 
 * Registers all core services with the DI container and provides
 * a centralized way to bootstrap the entire system.
 */
export class ServiceRegistry {
  private container: DIContainer;
  private static instance: ServiceRegistry;

  private constructor() {
    this.container = new DIContainer();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  /**
   * Get DI container
   */
  getContainer(): DIContainer {
    return this.container;
  }

  /**
   * Register all core services
   */
  async registerCoreServices(): Promise<void> {
    // Register ConfigService as singleton
    this.container.registerSingleton(
      ServiceTokens.CONFIG,
      () => ConfigService.getInstance()
    );

    // Register LoggerService as singleton (depends on config)
    this.container.registerSingleton(
      ServiceTokens.LOGGER,
      async (container) => {
        const config = await container.resolve<ConfigService>(ServiceTokens.CONFIG);
        return LoggerService.getInstance({
          level: config.get('LOG_LEVEL') as any,
          format: config.get('LOG_FORMAT') as any,
          colorize: !config.isProduction()
        });
      },
      [ServiceTokens.CONFIG]
    );

    // Register SupabaseService as singleton (depends on config and logger)
    this.container.registerSingleton(
      ServiceTokens.SUPABASE_SERVICE,
      () => SupabaseService.getInstance(),
      [ServiceTokens.CONFIG, ServiceTokens.LOGGER]
    );

    // Register OpenAIService as singleton (depends on config and logger)
    this.container.registerSingleton(
      ServiceTokens.OPENAI_SERVICE,
      () => OpenAIService.getInstance(),
      [ServiceTokens.CONFIG, ServiceTokens.LOGGER]
    );
  }

  /**
   * Initialize and test all services
   */
  async initializeServices(): Promise<void> {
    const logger = await this.container.resolve<LoggerService>(ServiceTokens.LOGGER);
    
    logger.info('Starting service initialization...');

    try {
      // Test Supabase connection
      const supabase = await this.container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);
      const dbConnected = await supabase.testConnection();
      
      if (dbConnected) {
        logger.info('✅ Supabase connection successful');
      } else {
        logger.warn('⚠️ Supabase connection failed');
      }

      // Test OpenAI connection
      const openai = await this.container.resolve<OpenAIService>(ServiceTokens.OPENAI_SERVICE);
      const aiConnected = await openai.testConnection();
      
      if (aiConnected) {
        logger.info('✅ OpenAI connection successful');
      } else {
        logger.warn('⚠️ OpenAI connection failed');
      }

      logger.info('✅ Service initialization completed');
    } catch (error) {
      logger.error('❌ Service initialization failed', error);
      throw error;
    }
  }

  /**
   * Shutdown all services gracefully
   */
  async shutdown(): Promise<void> {
    const logger = await this.container.resolve<LoggerService>(ServiceTokens.LOGGER);
    
    logger.info('Starting graceful shutdown...');

    try {
      // Dispose services in reverse order
      const supabase = this.container.resolveSync<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);
      await supabase.dispose();

      const openai = this.container.resolveSync<OpenAIService>(ServiceTokens.OPENAI_SERVICE);
      await openai.dispose();

      // Dispose DI container
      await this.container.dispose();

      logger.info('✅ Graceful shutdown completed');
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
    }
  }

  /**
   * Bootstrap the entire system
   */
  async bootstrap(): Promise<DIContainer> {
    await this.registerCoreServices();
    await this.initializeServices();
    return this.container;
  }
}
import { z } from 'zod';
import { ConfigurationError } from '../../../core/src/errors/ErrorHandler';

/**
 * Configuration Schema for AlphaAgents
 * 
 * Defines required and optional configuration values with validation
 */
const ConfigSchema = z.object({
  // Application
  APP_NAME: z.string().default('AlphaAgents'),
  APP_VERSION: z.string().default('1.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // OpenAI Configuration
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  OPENAI_ORG_ID: z.string().optional(),
  OPENAI_DEFAULT_MODEL: z.string().default('gpt-4'),
  OPENAI_VISION_MODEL: z.string().default('gpt-4o'),
  OPENAI_MAX_TOKENS: z.number().default(4000),
  OPENAI_TEMPERATURE: z.number().min(0).max(2).default(0.1),
  OPENAI_TIMEOUT: z.number().default(60000),
  
  // Supabase Configuration
  SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default('documents'),
  
  // Email Configuration (for future email agent)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // Agent Configuration
  AGENT_DEFAULT_TIMEOUT: z.number().default(30000),
  AGENT_MAX_RETRIES: z.number().default(3),
  AGENT_HEALTH_CHECK_INTERVAL: z.number().default(30000),
  
  // Security
  JWT_SECRET: z.string().optional(),
  ENCRYPTION_KEY: z.string().optional(),
  
  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),
  
  // Swiss Specific
  DEFAULT_LANGUAGE: z.string().default('de'),
  SUPPORTED_LANGUAGES: z.string().default('de,fr,it,en'),
  TIMEZONE: z.string().default('Europe/Zurich')
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Configuration Service for AlphaAgents
 * 
 * Handles environment variable loading, validation, and provides
 * type-safe access to configuration values.
 */
export class ConfigService {
  private static instance: ConfigService;
  private config: Config;

  private constructor() {
    this.config = this.loadAndValidateConfig();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Load and validate configuration from environment
   */
  private loadAndValidateConfig(): Config {
    try {
      // Load environment variables
      const env = process.env;
      
      // Convert string numbers to actual numbers
      const processedEnv = {
        ...env,
        OPENAI_MAX_TOKENS: env.OPENAI_MAX_TOKENS ? parseInt(env.OPENAI_MAX_TOKENS) : undefined,
        OPENAI_TEMPERATURE: env.OPENAI_TEMPERATURE ? parseFloat(env.OPENAI_TEMPERATURE) : undefined,
        OPENAI_TIMEOUT: env.OPENAI_TIMEOUT ? parseInt(env.OPENAI_TIMEOUT) : undefined,
        SMTP_PORT: env.SMTP_PORT ? parseInt(env.SMTP_PORT) : undefined,
        AGENT_DEFAULT_TIMEOUT: env.AGENT_DEFAULT_TIMEOUT ? parseInt(env.AGENT_DEFAULT_TIMEOUT) : undefined,
        AGENT_MAX_RETRIES: env.AGENT_MAX_RETRIES ? parseInt(env.AGENT_MAX_RETRIES) : undefined,
        AGENT_HEALTH_CHECK_INTERVAL: env.AGENT_HEALTH_CHECK_INTERVAL ? parseInt(env.AGENT_HEALTH_CHECK_INTERVAL) : undefined
      };

      // Validate with Zod schema
      const result = ConfigSchema.safeParse(processedEnv);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        
        throw new ConfigurationError(
          `Configuration validation failed: ${errors}`,
          { errors: result.error.errors }
        );
      }

      return result.data;
    } catch (error) {
      if (error instanceof ConfigurationError) {
        throw error;
      }
      
      throw new ConfigurationError(
        'Failed to load configuration',
        { originalError: error }
      );
    }
  }

  /**
   * Get configuration value
   */
  get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  /**
   * Get all configuration (for debugging)
   */
  getAll(): Readonly<Config> {
    return { ...this.config };
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  /**
   * Check if running in test mode
   */
  isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }

  /**
   * Get OpenAI configuration
   */
  getOpenAIConfig() {
    return {
      apiKey: this.config.OPENAI_API_KEY,
      organization: this.config.OPENAI_ORG_ID,
      defaultModel: this.config.OPENAI_DEFAULT_MODEL,
      visionModel: this.config.OPENAI_VISION_MODEL,
      maxTokens: this.config.OPENAI_MAX_TOKENS,
      temperature: this.config.OPENAI_TEMPERATURE,
      timeout: this.config.OPENAI_TIMEOUT
    };
  }

  /**
   * Get Supabase configuration
   */
  getSupabaseConfig() {
    return {
      url: this.config.SUPABASE_URL,
      anonKey: this.config.SUPABASE_ANON_KEY,
      serviceRoleKey: this.config.SUPABASE_SERVICE_ROLE_KEY,
      storageBucket: this.config.SUPABASE_STORAGE_BUCKET
    };
  }

  /**
   * Get agent default configuration
   */
  getAgentDefaults() {
    return {
      timeout: this.config.AGENT_DEFAULT_TIMEOUT,
      maxRetries: this.config.AGENT_MAX_RETRIES,
      healthCheckInterval: this.config.AGENT_HEALTH_CHECK_INTERVAL
    };
  }

  /**
   * Get supported languages array
   */
  getSupportedLanguages(): string[] {
    return this.config.SUPPORTED_LANGUAGES.split(',').map(lang => lang.trim());
  }

  /**
   * Validate required configuration for specific features
   */
  validateFeatureConfig(feature: 'openai' | 'supabase' | 'email'): void {
    switch (feature) {
      case 'openai':
        if (!this.config.OPENAI_API_KEY) {
          throw new ConfigurationError('OpenAI API key is required for AI features');
        }
        break;
        
      case 'supabase':
        if (!this.config.SUPABASE_URL || !this.config.SUPABASE_ANON_KEY) {
          throw new ConfigurationError('Supabase URL and anon key are required for database features');
        }
        break;
        
      case 'email':
        if (!this.config.SMTP_HOST || !this.config.SMTP_USER || !this.config.EMAIL_FROM) {
          throw new ConfigurationError('SMTP configuration is required for email features');
        }
        break;
    }
  }

  /**
   * Create agent configuration from defaults
   */
  createAgentConfig(overrides: Partial<{
    id: string;
    name: string;
    version: string;
    enabled: boolean;
    timeout: number;
    maxRetries: number;
    dependencies: string[];
  }>) {
    const defaults = this.getAgentDefaults();
    
    return {
      id: overrides.id || 'unknown-agent',
      name: overrides.name || 'UnknownAgent',
      version: overrides.version || this.config.APP_VERSION,
      enabled: overrides.enabled ?? true,
      maxRetries: overrides.maxRetries ?? defaults.maxRetries,
      timeout: overrides.timeout ?? defaults.timeout,
      dependencies: overrides.dependencies || [],
      healthCheckInterval: defaults.healthCheckInterval
    };
  }
}
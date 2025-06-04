/**
 * Dependency Injection Container for AlphaAgents
 * 
 * Manages service registration, resolution, and lifecycle for all agents and services.
 * Supports singleton and transient lifetimes, circular dependency detection.
 */

export enum ServiceLifetime {
  SINGLETON = 'singleton',
  TRANSIENT = 'transient'
}

export interface ServiceDescriptor<T = any> {
  token: string | symbol;
  factory: (container: DIContainer) => T | Promise<T>;
  lifetime: ServiceLifetime;
  dependencies?: (string | symbol)[];
}

export interface ServiceRegistration<T = any> extends ServiceDescriptor<T> {
  instance?: T;
  isResolving?: boolean;
}

/**
 * Lightweight Dependency Injection Container
 */
export class DIContainer {
  private services = new Map<string | symbol, ServiceRegistration>();
  private resolutionStack: Set<string | symbol> = new Set();

  /**
   * Register a service with the container
   */
  register<T>(descriptor: ServiceDescriptor<T>): void {
    if (this.services.has(descriptor.token)) {
      throw new Error(`Service with token '${descriptor.token.toString()}' is already registered`);
    }

    this.services.set(descriptor.token, {
      ...descriptor,
      instance: undefined,
      isResolving: false
    });
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(
    token: string | symbol,
    factory: (container: DIContainer) => T | Promise<T>,
    dependencies?: (string | symbol)[]
  ): void {
    this.register({
      token,
      factory,
      lifetime: ServiceLifetime.SINGLETON,
      dependencies
    });
  }

  /**
   * Register a transient service
   */
  registerTransient<T>(
    token: string | symbol,
    factory: (container: DIContainer) => T | Promise<T>,
    dependencies?: (string | symbol)[]
  ): void {
    this.register({
      token,
      factory,
      lifetime: ServiceLifetime.TRANSIENT,
      dependencies
    });
  }

  /**
   * Register a singleton instance
   */
  registerInstance<T>(token: string | symbol, instance: T): void {
    this.services.set(token, {
      token,
      factory: () => instance,
      lifetime: ServiceLifetime.SINGLETON,
      instance
    });
  }

  /**
   * Resolve a service from the container
   */
  async resolve<T>(token: string | symbol): Promise<T> {
    const registration = this.services.get(token);
    
    if (!registration) {
      throw new Error(`Service with token '${token.toString()}' is not registered`);
    }

    // Check for circular dependencies
    if (this.resolutionStack.has(token)) {
      const stack = Array.from(this.resolutionStack).map(t => t.toString()).join(' -> ');
      throw new Error(`Circular dependency detected: ${stack} -> ${token.toString()}`);
    }

    // Return existing singleton instance
    if (registration.lifetime === ServiceLifetime.SINGLETON && registration.instance) {
      return registration.instance;
    }

    // Prevent concurrent resolution of the same service
    if (registration.isResolving) {
      throw new Error(`Service '${token.toString()}' is already being resolved (possible circular dependency)`);
    }

    try {
      registration.isResolving = true;
      this.resolutionStack.add(token);

      // Resolve dependencies first
      if (registration.dependencies) {
        for (const dependency of registration.dependencies) {
          await this.resolve(dependency);
        }
      }

      // Create the service instance
      const instance = await registration.factory(this);

      // Store singleton instances
      if (registration.lifetime === ServiceLifetime.SINGLETON) {
        registration.instance = instance;
      }

      return instance;

    } finally {
      registration.isResolving = false;
      this.resolutionStack.delete(token);
    }
  }

  /**
   * Resolve a service synchronously (for already resolved singletons)
   */
  resolveSync<T>(token: string | symbol): T {
    const registration = this.services.get(token);
    
    if (!registration) {
      throw new Error(`Service with token '${token.toString()}' is not registered`);
    }

    if (registration.lifetime === ServiceLifetime.SINGLETON && registration.instance) {
      return registration.instance;
    }

    throw new Error(`Service '${token.toString()}' is not available synchronously. Use resolve() for async resolution.`);
  }

  /**
   * Check if a service is registered
   */
  isRegistered(token: string | symbol): boolean {
    return this.services.has(token);
  }

  /**
   * Get all registered service tokens
   */
  getRegisteredServices(): (string | symbol)[] {
    return Array.from(this.services.keys());
  }

  /**
   * Clear all services (useful for testing)
   */
  clear(): void {
    this.services.clear();
    this.resolutionStack.clear();
  }

  /**
   * Dispose of all singleton instances (if they implement dispose)
   */
  async dispose(): Promise<void> {
    const disposableServices = Array.from(this.services.values())
      .filter(reg => reg.instance && typeof (reg.instance as any).dispose === 'function');

    await Promise.all(
      disposableServices.map(async (reg) => {
        try {
          await (reg.instance as any).dispose();
        } catch (error) {
          console.error(`Error disposing service '${reg.token.toString()}':`, error);
        }
      })
    );

    this.clear();
  }
}

/**
 * Service Tokens - Centralized service identifiers
 */
export const ServiceTokens = {
  // Core Services
  LOGGER: Symbol('Logger'),
  CONFIG: Symbol('Config'),
  DATABASE: Symbol('Database'),
  
  // External Services
  OPENAI_SERVICE: Symbol('OpenAIService'),
  SUPABASE_SERVICE: Symbol('SupabaseService'),
  EMAIL_SERVICE: Symbol('EmailService'),
  
  // Agents
  MANAGER_AGENT: Symbol('ManagerAgent'),
  DOCUMENT_AGENT: Symbol('DocumentAgent'),
  OCR_AGENT: Symbol('OCRAgent'),
  EMAIL_AGENT: Symbol('EmailAgent'),
  CHAT_AGENT: Symbol('ChatAgent'),
  
  // Agent Services
  AGENT_REGISTRY: Symbol('AgentRegistry'),
  AGENT_COMMUNICATOR: Symbol('AgentCommunicator'),
  HEALTH_MONITOR: Symbol('HealthMonitor')
} as const;
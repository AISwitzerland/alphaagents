import { DIContainer } from '../../../../packages/core/src/container/DIContainer';
import { ServiceRegistry } from '../../../../packages/core/src/services/ServiceRegistry';

/**
 * Global service container singleton
 * Prevents multiple service registrations in Next.js API routes
 */
class GlobalServiceContainer {
  private static instance: GlobalServiceContainer;
  private container: DIContainer | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): GlobalServiceContainer {
    if (!GlobalServiceContainer.instance) {
      GlobalServiceContainer.instance = new GlobalServiceContainer();
    }
    return GlobalServiceContainer.instance;
  }

  async getContainer(): Promise<DIContainer> {
    if (!this.isInitialized || !this.container) {
      console.log('🔄 Initializing global service container...');
      
      try {
        const serviceRegistry = ServiceRegistry.getInstance();
        this.container = await serviceRegistry.bootstrap();
        this.isInitialized = true;
        
        console.log('✅ Global service container initialized');
      } catch (error) {
        console.error('❌ Service container initialization failed:', error);
        
        // Reset and try again with fresh instances
        this.reset();
        const serviceRegistry = new ServiceRegistry();
        this.container = await serviceRegistry.bootstrap();
        this.isInitialized = true;
        
        console.log('✅ Global service container initialized (recovery)');
      }
    }
    
    return this.container;
  }

  reset(): void {
    console.log('🔄 Resetting global service container...');
    this.container = null;
    this.isInitialized = false;
  }

  isReady(): boolean {
    return this.isInitialized && this.container !== null;
  }
}

export const globalServices = GlobalServiceContainer.getInstance();
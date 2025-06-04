import { DIContainer, ServiceLifetime, ServiceTokens } from '../container/DIContainer';

// Test services
interface ITestService {
  getValue(): string;
}

class TestService implements ITestService {
  private value: string;

  constructor(value: string = 'default') {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}

interface IDependentService {
  getDependentValue(): string;
}

class DependentService implements IDependentService {
  constructor(private testService: ITestService) {}

  getDependentValue(): string {
    return `dependent-${this.testService.getValue()}`;
  }
}

class DisposableService {
  public disposed = false;

  async dispose(): Promise<void> {
    this.disposed = true;
  }
}

describe('DIContainer', () => {
  let container: DIContainer;

  beforeEach(() => {
    container = new DIContainer();
  });

  afterEach(async () => {
    await container.dispose();
  });

  describe('Service Registration', () => {
    test('should register singleton service', () => {
      container.registerSingleton('test-service', () => new TestService('singleton'));
      
      expect(container.isRegistered('test-service')).toBe(true);
    });

    test('should register transient service', () => {
      container.registerTransient('test-service', () => new TestService('transient'));
      
      expect(container.isRegistered('test-service')).toBe(true);
    });

    test('should register instance', () => {
      const instance = new TestService('instance');
      container.registerInstance('test-service', instance);
      
      expect(container.isRegistered('test-service')).toBe(true);
    });

    test('should throw error when registering duplicate service', () => {
      container.registerSingleton('test-service', () => new TestService());
      
      expect(() => {
        container.registerSingleton('test-service', () => new TestService());
      }).toThrow('Service with token \'test-service\' is already registered');
    });
  });

  describe('Service Resolution', () => {
    test('should resolve singleton service', async () => {
      container.registerSingleton('test-service', () => new TestService('singleton-value'));
      
      const service1 = await container.resolve<ITestService>('test-service');
      const service2 = await container.resolve<ITestService>('test-service');
      
      expect(service1).toBe(service2); // Same instance
      expect(service1.getValue()).toBe('singleton-value');
    });

    test('should resolve transient service', async () => {
      container.registerTransient('test-service', () => new TestService('transient-value'));
      
      const service1 = await container.resolve<ITestService>('test-service');
      const service2 = await container.resolve<ITestService>('test-service');
      
      expect(service1).not.toBe(service2); // Different instances
      expect(service1.getValue()).toBe('transient-value');
      expect(service2.getValue()).toBe('transient-value');
    });

    test('should resolve registered instance', async () => {
      const instance = new TestService('instance-value');
      container.registerInstance('test-service', instance);
      
      const resolved = await container.resolve<ITestService>('test-service');
      
      expect(resolved).toBe(instance);
      expect(resolved.getValue()).toBe('instance-value');
    });

    test('should throw error when resolving unregistered service', async () => {
      await expect(container.resolve('unregistered-service')).rejects.toThrow(
        'Service with token \'unregistered-service\' is not registered'
      );
    });
  });

  describe('Dependency Resolution', () => {
    test('should resolve service with dependencies', async () => {
      container.registerSingleton('test-service', () => new TestService('dependency-value'));
      container.registerSingleton(
        'dependent-service',
        async (container) => {
          const testService = await container.resolve<ITestService>('test-service');
          return new DependentService(testService);
        },
        ['test-service']
      );
      
      const dependentService = await container.resolve<IDependentService>('dependent-service');
      
      expect(dependentService.getDependentValue()).toBe('dependent-dependency-value');
    });

    test('should detect circular dependencies', async () => {
      container.registerSingleton(
        'service-a',
        async (container) => {
          await container.resolve('service-b');
          return 'service-a';
        },
        ['service-b']
      );
      
      container.registerSingleton(
        'service-b',
        async (container) => {
          await container.resolve('service-a');
          return 'service-b';
        },
        ['service-a']
      );
      
      await expect(container.resolve('service-a')).rejects.toThrow('Circular dependency detected');
    });

    test('should handle complex dependency chains', async () => {
      container.registerSingleton('service-1', () => 'value-1');
      container.registerSingleton(
        'service-2',
        async (container) => {
          const dep = await container.resolve<string>('service-1');
          return `service-2-${dep}`;
        },
        ['service-1']
      );
      container.registerSingleton(
        'service-3',
        async (container) => {
          const dep = await container.resolve<string>('service-2');
          return `service-3-${dep}`;
        },
        ['service-2']
      );
      
      const result = await container.resolve<string>('service-3');
      
      expect(result).toBe('service-3-service-2-value-1');
    });
  });

  describe('Synchronous Resolution', () => {
    test('should resolve singleton synchronously after async resolution', async () => {
      container.registerSingleton('test-service', () => new TestService('sync-test'));
      
      // First resolve async
      await container.resolve<ITestService>('test-service');
      
      // Then resolve sync
      const service = container.resolveSync<ITestService>('test-service');
      expect(service.getValue()).toBe('sync-test');
    });

    test('should throw error for sync resolution of unresolved service', () => {
      container.registerSingleton('test-service', () => new TestService());
      
      expect(() => {
        container.resolveSync('test-service');
      }).toThrow('Service \'test-service\' is not available synchronously');
    });

    test('should throw error for sync resolution of transient service', async () => {
      container.registerTransient('test-service', () => new TestService());
      
      await container.resolve('test-service'); // Resolve once
      
      expect(() => {
        container.resolveSync('test-service');
      }).toThrow('Service \'test-service\' is not available synchronously');
    });
  });

  describe('Container Management', () => {
    test('should return list of registered services', () => {
      container.registerSingleton('service-1', () => 'value-1');
      container.registerSingleton('service-2', () => 'value-2');
      container.registerTransient('service-3', () => 'value-3');
      
      const services = container.getRegisteredServices();
      
      expect(services).toContain('service-1');
      expect(services).toContain('service-2');
      expect(services).toContain('service-3');
      expect(services).toHaveLength(3);
    });

    test('should clear all services', () => {
      container.registerSingleton('service-1', () => 'value-1');
      container.registerSingleton('service-2', () => 'value-2');
      
      expect(container.getRegisteredServices()).toHaveLength(2);
      
      container.clear();
      
      expect(container.getRegisteredServices()).toHaveLength(0);
      expect(container.isRegistered('service-1')).toBe(false);
    });

    test('should dispose all disposable services', async () => {
      const disposableService = new DisposableService();
      container.registerInstance('disposable-service', disposableService);
      
      await container.dispose();
      
      expect(disposableService.disposed).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle factory errors gracefully', async () => {
      container.registerSingleton('failing-service', () => {
        throw new Error('Factory error');
      });
      
      await expect(container.resolve('failing-service')).rejects.toThrow('Factory error');
    });

    test('should handle async factory errors', async () => {
      container.registerSingleton('async-failing-service', async () => {
        throw new Error('Async factory error');
      });
      
      await expect(container.resolve('async-failing-service')).rejects.toThrow('Async factory error');
    });

    test('should handle disposal errors gracefully', async () => {
      const faultyService = {
        dispose: jest.fn().mockRejectedValue(new Error('Disposal error'))
      };
      
      container.registerInstance('faulty-service', faultyService);
      
      // Should not throw, but log error
      await expect(container.dispose()).resolves.not.toThrow();
      expect(faultyService.dispose).toHaveBeenCalled();
    });
  });

  describe('Service Tokens', () => {
    test('should work with symbol tokens', async () => {
      const TOKEN = Symbol('test-token');
      container.registerSingleton(TOKEN, () => new TestService('symbol-service'));
      
      const service = await container.resolve<ITestService>(TOKEN);
      
      expect(service.getValue()).toBe('symbol-service');
    });

    test('should use predefined service tokens', async () => {
      container.registerSingleton(ServiceTokens.LOGGER, () => ({ log: () => 'logged' }));
      
      const logger = await container.resolve(ServiceTokens.LOGGER);
      
      expect(logger.log()).toBe('logged');
    });
  });
});
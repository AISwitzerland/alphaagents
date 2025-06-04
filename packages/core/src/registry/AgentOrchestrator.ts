import { DIContainer, ServiceTokens } from '../container/DIContainer';
import { ServiceRegistry } from '../services/ServiceRegistry';
import { LoggerService } from '../../../services/src';
import { BaseAgent } from '../agents/BaseAgent';
import { AgentConfig, AgentContext, AgentResult, LogLevel } from '../../../shared/src/types/agent';
import { ErrorHandler, ErrorCodes } from '../errors/ErrorHandler';

// Import all agents
import { ManagerAgent } from '../../../agents/src/manager/ManagerAgent';
import { DocumentAgent } from '../../../agents/src/document/DocumentAgent';
import { OCRAgent } from '../../../agents/src/ocr/OCRAgent';
import { EmailAgent } from '../../../agents/src/email/EmailAgent';
import { ChatAgent } from '../../../agents/src/chat/ChatAgent';

/**
 * Agent Registry Entry
 */
export interface AgentRegistryEntry {
  id: string;
  name: string;
  agent: BaseAgent;
  config: AgentConfig;
  status: 'registered' | 'starting' | 'running' | 'stopped' | 'error';
  dependencies: string[];
  healthStatus: {
    healthy: boolean;
    lastCheck: Date;
    errorCount: number;
  };
}

/**
 * System Status
 */
export interface SystemStatus {
  overall: 'healthy' | 'degraded' | 'critical' | 'offline';
  agents: {
    total: number;
    running: number;
    healthy: number;
    errors: number;
  };
  services: {
    database: boolean;
    ai: boolean;
    storage: boolean;
  };
  uptime: number;
  version: string;
}

/**
 * Agent Orchestrator - Central Agent Management
 * 
 * Manages the complete lifecycle of all AlphaAgents:
 * - Agent registration and dependency resolution
 * - Coordinated startup and shutdown sequences
 * - Inter-agent communication routing
 * - System-wide health monitoring
 * - Graceful error recovery and escalation
 */
export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private container: DIContainer;
  private serviceRegistry: ServiceRegistry;
  private logger!: LoggerService;
  private errorHandler: ErrorHandler;
  
  private agentRegistry: Map<string, AgentRegistryEntry> = new Map();
  private managerAgent: ManagerAgent | null = null;
  private systemStartTime: Date = new Date();
  private isInitialized = false;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  /**
   * Initialize the complete AlphaAgents system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log('🚀 AlphaAgents System Initialization Started...\n');

    try {
      // 1. Bootstrap core services (including logger)
      await this.bootstrapServices();
      
      // 2. Register all agents
      await this.registerAllAgents();
      
      // 3. Start agents in dependency order
      await this.startAgentsOrchestrated();
      
      // 4. Initialize manager agent monitoring
      await this.initializeManagerMonitoring();

      this.isInitialized = true;
      
      this.logger.info('✅ AlphaAgents System fully initialized', {
        totalAgents: this.agentRegistry.size,
        systemStartTime: this.systemStartTime,
        version: '1.0.0'
      });

      console.log('✅ AlphaAgents System Ready for Production!\n');
      
    } catch (error) {
      // Use console.error if logger not yet initialized
      if (this.logger) {
        this.logger.error('❌ System initialization failed', error);
      }
      console.error('❌ System initialization failed:', error);
      throw error;
    }
  }

  /**
   * Bootstrap core services
   */
  private async bootstrapServices(): Promise<void> {
    console.log('📦 Bootstrapping Core Services...');
    
    this.serviceRegistry = ServiceRegistry.getInstance();
    this.container = await this.serviceRegistry.bootstrap();
    this.logger = await this.container.resolve<LoggerService>(ServiceTokens.LOGGER);
    
    this.logger.info('Core services bootstrapped successfully');
    console.log('✅ Core Services Ready');
  }

  /**
   * Register all agents with their configurations
   */
  private async registerAllAgents(): Promise<void> {
    console.log('🤖 Registering All Agents...');
    
    try {
      // Agent configurations
      const agentConfigs = this.createAgentConfigurations();
      
      // Register Manager Agent (orchestrator)
      await this.registerManagerAgent(agentConfigs.manager);
      
      // Register Core Agents
      await this.registerDocumentAgent(agentConfigs.document);
      await this.registerOCRAgent(agentConfigs.ocr);
      
      // Register Customer Interaction Agents
      await this.registerEmailAgent(agentConfigs.email);
      await this.registerChatAgent(agentConfigs.chat);
      
      this.logger.info('All agents registered successfully', {
        registeredAgents: Array.from(this.agentRegistry.keys())
      });
      
      console.log(`✅ ${this.agentRegistry.size} Agents Registered`);
      
    } catch (error) {
      this.logger.error('Agent registration failed', error);
      throw error;
    }
  }

  /**
   * Create standardized agent configurations
   */
  private createAgentConfigurations(): Record<string, AgentConfig> {
    const baseConfig = {
      version: '1.0.0',
      enabled: true,
      maxRetries: 3,
      timeout: 30000,
      healthCheckInterval: 30000
    };

    return {
      manager: {
        ...baseConfig,
        id: 'manager-agent-001',
        name: 'ManagerAgent',
        dependencies: [],
        timeout: 60000 // Manager needs more time
      },
      document: {
        ...baseConfig,
        id: 'document-agent-001', 
        name: 'DocumentAgent',
        dependencies: [],
        timeout: 45000 // File processing needs time
      },
      ocr: {
        ...baseConfig,
        id: 'ocr-agent-001',
        name: 'OCRAgent', 
        dependencies: ['document-agent-001'],
        timeout: 120000 // Vision processing is slow
      },
      email: {
        ...baseConfig,
        id: 'email-agent-001',
        name: 'EmailAgent',
        dependencies: ['document-agent-001'],
        timeout: 60000
      },
      chat: {
        ...baseConfig,
        id: 'chat-agent-001',
        name: 'ChatAgent',
        dependencies: ['document-agent-001'],
        timeout: 30000
      }
    };
  }

  /**
   * Register Manager Agent
   */
  private async registerManagerAgent(config: AgentConfig): Promise<void> {
    const agent = new ManagerAgent(config, this.container);
    this.managerAgent = agent;
    
    const entry: AgentRegistryEntry = {
      id: config.id,
      name: config.name,
      agent,
      config,
      status: 'registered',
      dependencies: config.dependencies,
      healthStatus: {
        healthy: false,
        lastCheck: new Date(),
        errorCount: 0
      }
    };
    
    this.agentRegistry.set(config.id, entry);
    console.log('  📋 Manager Agent registered');
  }

  /**
   * Register Document Agent
   */
  private async registerDocumentAgent(config: AgentConfig): Promise<void> {
    const agent = new DocumentAgent(config, this.container);
    
    const entry: AgentRegistryEntry = {
      id: config.id,
      name: config.name,
      agent,
      config,
      status: 'registered',
      dependencies: config.dependencies,
      healthStatus: {
        healthy: false,
        lastCheck: new Date(),
        errorCount: 0
      }
    };
    
    this.agentRegistry.set(config.id, entry);
    console.log('  📄 Document Agent registered');
  }

  /**
   * Register OCR Agent
   */
  private async registerOCRAgent(config: AgentConfig): Promise<void> {
    const agent = new OCRAgent(config, this.container);
    
    const entry: AgentRegistryEntry = {
      id: config.id,
      name: config.name,
      agent,
      config,
      status: 'registered',
      dependencies: config.dependencies,
      healthStatus: {
        healthy: false,
        lastCheck: new Date(),
        errorCount: 0
      }
    };
    
    this.agentRegistry.set(config.id, entry);
    console.log('  👁️ OCR Agent registered');
  }

  /**
   * Register Email Agent
   */
  private async registerEmailAgent(config: AgentConfig): Promise<void> {
    const agent = new EmailAgent(config, this.container);
    
    const entry: AgentRegistryEntry = {
      id: config.id,
      name: config.name,
      agent,
      config,
      status: 'registered',
      dependencies: config.dependencies,
      healthStatus: {
        healthy: false,
        lastCheck: new Date(),
        errorCount: 0
      }
    };
    
    this.agentRegistry.set(config.id, entry);
    console.log('  📧 Email Agent registered');
  }

  /**
   * Register Chat Agent
   */
  private async registerChatAgent(config: AgentConfig): Promise<void> {
    const agent = new ChatAgent(config, this.container);
    
    const entry: AgentRegistryEntry = {
      id: config.id,
      name: config.name,
      agent,
      config,
      status: 'registered',
      dependencies: config.dependencies,
      healthStatus: {
        healthy: false,
        lastCheck: new Date(),
        errorCount: 0
      }
    };
    
    this.agentRegistry.set(config.id, entry);
    console.log('  💬 Chat Agent registered');
  }

  /**
   * Start all agents in dependency order
   */
  private async startAgentsOrchestrated(): Promise<void> {
    console.log('⚡ Starting Agents in Dependency Order...');
    
    // Calculate startup order based on dependencies
    const startupOrder = this.calculateStartupOrder();
    
    for (const agentId of startupOrder) {
      await this.startAgent(agentId);
    }
    
    console.log('✅ All Agents Started Successfully');
  }

  /**
   * Calculate agent startup order based on dependencies
   */
  private calculateStartupOrder(): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (agentId: string) => {
      if (visited.has(agentId)) return;
      if (visiting.has(agentId)) {
        throw new Error(`Circular dependency detected involving ${agentId}`);
      }

      visiting.add(agentId);
      
      const entry = this.agentRegistry.get(agentId);
      if (entry) {
        // Visit dependencies first
        for (const depId of entry.dependencies) {
          visit(depId);
        }
      }
      
      visiting.delete(agentId);
      visited.add(agentId);
      order.push(agentId);
    };

    // Visit all agents
    for (const agentId of this.agentRegistry.keys()) {
      visit(agentId);
    }

    return order;
  }

  /**
   * Start individual agent
   */
  private async startAgent(agentId: string): Promise<void> {
    const entry = this.agentRegistry.get(agentId);
    if (!entry) {
      throw new Error(`Agent ${agentId} not found in registry`);
    }

    try {
      console.log(`  🔄 Starting ${entry.name}...`);
      entry.status = 'starting';
      
      await entry.agent.start();
      
      entry.status = 'running';
      entry.healthStatus.healthy = true;
      entry.healthStatus.lastCheck = new Date();
      
      this.logger.info(`Agent ${entry.name} started successfully`, {
        agentId: entry.id,
        config: entry.config
      });
      
      console.log(`  ✅ ${entry.name} running`);
      
    } catch (error) {
      entry.status = 'error';
      entry.healthStatus.healthy = false;
      entry.healthStatus.errorCount++;
      
      this.logger.error(`Failed to start agent ${entry.name}`, error);
      console.error(`  ❌ ${entry.name} failed to start:`, error);
      throw error;
    }
  }

  /**
   * Initialize Manager Agent monitoring of all other agents
   */
  private async initializeManagerMonitoring(): Promise<void> {
    if (!this.managerAgent) {
      throw new Error('Manager Agent not initialized');
    }

    console.log('🔍 Initializing System Monitoring...');

    // Register all other agents with the Manager
    for (const [agentId, entry] of this.agentRegistry) {
      if (agentId !== 'manager-agent-001') {
        this.managerAgent.registerAgent(agentId, entry.agent);
      }
    }

    this.logger.info('Manager Agent monitoring initialized', {
      monitoredAgents: this.agentRegistry.size - 1
    });
    
    console.log('✅ System Monitoring Active');
  }

  // === PUBLIC API METHODS ===

  /**
   * Execute document processing workflow
   */
  async processDocument(
    documentBuffer: Buffer,
    filename: string,
    mimeType: string,
    userInfo?: any
  ): Promise<{
    documentRecord: any;
    ocrResult: any;
  }> {
    this.ensureInitialized();

    const context: AgentContext = {
      agentId: 'orchestrator',
      sessionId: `doc-${Date.now()}`,
      timestamp: new Date(),
      metadata: { workflow: 'document_processing' }
    };

    try {
      // 1. Process with Document Agent
      const documentAgent = this.getAgent('document-agent-001');
      const docResult = await documentAgent.run({
        action: 'upload',
        file: {
          buffer: documentBuffer,
          originalName: filename,
          mimeType: mimeType,
          size: documentBuffer.length
        },
        userInfo
      }, context);

      if (!docResult.success || !docResult.data?.documentRecord) {
        throw new Error('Document processing failed');
      }

      // 2. Process with OCR Agent
      const ocrAgent = this.getAgent('ocr-agent-001');
      const ocrResult = await ocrAgent.run({
        action: 'processDocument',
        documentId: docResult.data.documentRecord.id
      }, context);

      return {
        documentRecord: docResult.data.documentRecord,
        ocrResult: ocrResult.data
      };

    } catch (error) {
      this.logger.error('Document processing workflow failed', error);
      throw error;
    }
  }

  /**
   * Process email workflow
   */
  async processEmail(email: any): Promise<any> {
    this.ensureInitialized();

    const context: AgentContext = {
      agentId: 'orchestrator',
      sessionId: `email-${Date.now()}`,
      timestamp: new Date(),
      metadata: { workflow: 'email_processing' }
    };

    try {
      const emailAgent = this.getAgent('email-agent-001');
      const result = await emailAgent.run({
        action: 'processIncoming',
        email
      }, context);

      return result.data;

    } catch (error) {
      this.logger.error('Email processing workflow failed', error);
      throw error;
    }
  }

  /**
   * Handle chat interaction
   */
  async handleChat(sessionId: string, message: string, context?: any): Promise<any> {
    this.ensureInitialized();

    const agentContext: AgentContext = {
      agentId: 'orchestrator',
      sessionId,
      timestamp: new Date(),
      metadata: { workflow: 'chat_interaction' }
    };

    try {
      const chatAgent = this.getAgent('chat-agent-001');
      const result = await chatAgent.run({
        action: 'chat',
        sessionId,
        message,
        context
      }, agentContext);

      return result.data;

    } catch (error) {
      this.logger.error('Chat interaction failed', error);
      throw error;
    }
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<SystemStatus> {
    this.ensureInitialized();

    if (!this.managerAgent) {
      throw new Error('Manager Agent not available');
    }

    const context: AgentContext = {
      agentId: 'orchestrator',
      sessionId: `status-${Date.now()}`,
      timestamp: new Date()
    };

    try {
      const result = await this.managerAgent.run({
        command: 'systemStatus'
      }, context);

      const runningAgents = Array.from(this.agentRegistry.values())
        .filter(entry => entry.status === 'running').length;
      
      const healthyAgents = Array.from(this.agentRegistry.values())
        .filter(entry => entry.healthStatus.healthy).length;
      
      const errorAgents = Array.from(this.agentRegistry.values())
        .filter(entry => entry.status === 'error').length;

      let overall: SystemStatus['overall'] = 'healthy';
      if (errorAgents > 0) overall = 'critical';
      else if (healthyAgents < this.agentRegistry.size * 0.8) overall = 'degraded';

      return {
        overall,
        agents: {
          total: this.agentRegistry.size,
          running: runningAgents,
          healthy: healthyAgents,
          errors: errorAgents
        },
        services: result.data?.systemMetrics || {
          database: true,
          ai: true,
          storage: true
        },
        uptime: Date.now() - this.systemStartTime.getTime(),
        version: '1.0.0'
      };

    } catch (error) {
      this.logger.error('Failed to get system status', error);
      return {
        overall: 'critical',
        agents: { total: 0, running: 0, healthy: 0, errors: 1 },
        services: { database: false, ai: false, storage: false },
        uptime: 0,
        version: '1.0.0'
      };
    }
  }

  /**
   * Graceful system shutdown
   */
  async shutdown(): Promise<void> {
    console.log('🔄 Initiating Graceful System Shutdown...');

    if (this.managerAgent) {
      try {
        const context: AgentContext = {
          agentId: 'orchestrator',
          sessionId: `shutdown-${Date.now()}`,
          timestamp: new Date()
        };

        await this.managerAgent.run({ command: 'shutdown' }, context);
      } catch (error) {
        console.warn('Manager shutdown failed:', error);
      }
    }

    // Stop all agents in reverse order
    const shutdownOrder = this.calculateStartupOrder().reverse();
    
    for (const agentId of shutdownOrder) {
      const entry = this.agentRegistry.get(agentId);
      if (entry) {
        try {
          console.log(`  🔄 Stopping ${entry.name}...`);
          await entry.agent.stop();
          entry.status = 'stopped';
          console.log(`  ✅ ${entry.name} stopped`);
        } catch (error) {
          console.warn(`  ⚠️ ${entry.name} shutdown error:`, error);
        }
      }
    }

    // Shutdown services
    if (this.serviceRegistry) {
      await this.serviceRegistry.shutdown();
    }

    this.isInitialized = false;
    console.log('✅ System Shutdown Complete');
  }

  // === UTILITY METHODS ===

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('AgentOrchestrator not initialized. Call initialize() first.');
    }
  }

  private getAgent(agentId: string): BaseAgent {
    const entry = this.agentRegistry.get(agentId);
    if (!entry) {
      throw new Error(`Agent ${agentId} not found`);
    }
    if (entry.status !== 'running') {
      throw new Error(`Agent ${agentId} is not running (status: ${entry.status})`);
    }
    return entry.agent;
  }

  /**
   * Get all registered agents info
   */
  getRegisteredAgents(): AgentRegistryEntry[] {
    return Array.from(this.agentRegistry.values());
  }

  /**
   * Get specific agent status
   */
  getAgentStatus(agentId: string): AgentRegistryEntry | null {
    return this.agentRegistry.get(agentId) || null;
  }
}
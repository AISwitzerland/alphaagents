import { OCRAgent } from '../agents/ocrProcessor/OCRAgent';
import DocumentAgent from '../agents/documentProcessor/DocumentAgent';
import { DocumentClassificationAgent } from './documentClassifier';
import logger from '../utils/logger';

// Typdefinition für Agenten
interface Agent {
  getName(): string;
}

// Map für die gespeicherten Agenten
const agentRegistry = new Map<string, Agent>();
let agentRegistryInitialized = false;

/**
 * Initialisiert die Agent-Registry
 */
export function initializeAgentRegistry(): void {
  if (agentRegistryInitialized) {
    logger.info('Agent Registry already initialized');
    return;
  }

  logger.info('Initializing Agent Registry...');
  
  try {
    // Registriere Dokument-Agent
    try {
      agentRegistry.set('document', DocumentAgent.getInstance());
      logger.info('Document Agent successfully registered');
    } catch (error) {
      logger.warn('Failed to register Document Agent:', error);
    }
    
    // Registriere OCR-Agent
    try {
      agentRegistry.set('ocr', new OCRAgent());
      logger.info('OCR Agent successfully registered');
    } catch (error) {
      logger.warn('Failed to register OCR Agent:', error);
    }
    
    // Registriere Klassifikations-Agent
    try {
      agentRegistry.set('classification', new DocumentClassificationAgent());
      logger.info('Classification Agent successfully registered');
    } catch (error) {
      logger.warn('Failed to register Classification Agent:', error);
    }
    
    agentRegistryInitialized = true;
    logger.info('Agent Registry initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Agent Registry:', error);
    throw new Error('Agent Registry initialization failed');
  }
}

/**
 * Gibt einen Agenten aus der Registry zurück
 * @param agentId Die ID des gesuchten Agenten
 * @returns Der angeforderte Agent
 */
export function getAgent<T extends Agent>(agentId: string): T {
  if (!agentRegistryInitialized) {
    initializeAgentRegistry();
  }
  
  const agent = agentRegistry.get(agentId);
  if (!agent) {
    throw new Error(`Agent with ID '${agentId}' not found in registry`);
  }
  
  return agent as T;
}

/**
 * Gibt den OCR-Agenten zurück
 */
export function getOCRAgent(): OCRAgent {
  return getAgent<OCRAgent>('ocr');
}

/**
 * Gibt den Dokument-Agenten zurück
 */
export function getDocumentAgent(): DocumentAgent {
  return getAgent<DocumentAgent>('document');
}

/**
 * Gibt den Klassifikations-Agenten zurück
 */
export function getClassificationAgent(): DocumentClassificationAgent {
  return getAgent<DocumentClassificationAgent>('classification');
}

/**
 * Fährt alle Agenten herunter
 */
export async function shutdownAgents(): Promise<void> {
  logger.info('Shutting down all agents...');
  
  try {
    // Der DocumentAgent hat möglicherweise eine shutdown-Methode
    const documentAgent = agentRegistry.get('document') as DocumentAgent;
    if (documentAgent && typeof documentAgent.shutdown === 'function') {
      await documentAgent.shutdown();
      logger.info('Document Agent successfully shut down');
    }
    
    // Registry zurücksetzen
    agentRegistry.clear();
    agentRegistryInitialized = false;
    
    logger.info('All agents successfully shut down');
  } catch (error) {
    logger.error('Error during agent shutdown:', error);
    throw new Error('Failed to shutdown agents properly');
  }
} 
import { AgentType } from '../types/coordination';
import { BaseAgent } from '../interfaces/BaseAgent';
import { DocumentAgent } from '../agents/documentProcessor/DocumentAgent';
import { OCRAgentSimplified } from '../agents/ocrProcessor/OCRAgentSimplified';

// Singleton-Instanz der Registry
let agentRegistryInstance: Map<AgentType, BaseAgent> | null = null;

/**
 * Initialisiert die Registry mit allen verfügbaren Agenten
 */
export function initializeAgentRegistry(): Map<AgentType, BaseAgent> {
  const registry = new Map<AgentType, BaseAgent>();
  
  // Registriere den DocumentAgent
  try {
    registry.set('document', DocumentAgent.getInstance());
    console.log('DocumentAgent successfully registered');
  } catch (error) {
    console.warn('Failed to register DocumentAgent:', error);
  }
  
  // Registriere den simulierten OCR-Agent (ohne externe Abhängigkeiten)
  try {
    registry.set('ocr', OCRAgentSimplified.getInstance());
    console.log('OCRAgentSimplified successfully registered');
  } catch (error) {
    console.warn('Failed to register OCRAgentSimplified:', error);
  }
  
  // Hier würden weitere Agenten registriert werden, sobald sie implementiert sind
  // Beispiele:
  // registry.set('classification', ClassificationAgent.getInstance());
  // registry.set('extraction', ExtractionAgent.getInstance());
  // registry.set('feedback', FeedbackAgent.getInstance());
  
  return registry;
}

/**
 * Gibt die Agent-Registry zurück
 */
export function getAgentRegistry(): Map<AgentType, BaseAgent> {
  if (!agentRegistryInstance) {
    agentRegistryInstance = initializeAgentRegistry();
  }
  return agentRegistryInstance;
} 
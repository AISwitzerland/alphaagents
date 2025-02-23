import { Intent, IntentEntity, IntentResult, IntentCategory } from '@/types/intent';
import { SupportedLanguages } from '@/types';
import { MULTILINGUAL_INTENT_PATTERNS, URGENCY_INDICATORS, intentPatterns } from '@/data/intentPatterns';

// Definieren der Intent-Patterns
const INTENT_PATTERNS = {
  INFORMATION: {
    keywords: [
      'information',
      'info',
      'details',
      'erklären',
      'wie funktioniert',
      'was ist',
      'bedeutet',
      'verstehen',
      'wissen',
    ],
    insuranceTypes: [
      'krankenversicherung',
      'hausrat',
      'haftpflicht',
      'auto',
      'leben',
      'unfall',
      'rechtsschutz',
    ],
  },
  PRICE: {
    keywords: [
      'preis',
      'kosten',
      'prämie',
      'offerte',
      'angebot',
      'rabatt',
      'sparen',
      'günstiger',
      'teuer',
      'bezahlen',
    ],
    amounts: ['chf', 'franken', 'fr.', '%', 'prozent'],
  },
  CLAIM: {
    keywords: [
      'schaden',
      'unfall',
      'schadenfall',
      'melden',
      'beschädigt',
      'gestohlen',
      'verloren',
      'kaputt',
    ],
    urgencyIndicators: ['sofort', 'dringend', 'notfall', 'schnell', 'eilig'],
  },
  COVERAGE: {
    keywords: [
      'deckung',
      'versichert',
      'abgedeckt',
      'geltungsbereich',
      'leistung',
      'eingeschlossen',
      'ausgeschlossen',
    ],
  },
  DOCUMENT: {
    keywords: [
      'dokument',
      'police',
      'vertrag',
      'bescheinigung',
      'nachweis',
      'formular',
      'unterlagen',
    ],
    documentTypes: ['versicherungsschein', 'rechnung', 'quittung', 'antrag', 'kündigung'],
  },
  COMPLAINT: {
    keywords: ['beschwerde', 'unzufrieden', 'problem', 'ärger', 'fehler', 'falsch', 'reklamation'],
    sentimentIndicators: ['enttäuscht', 'verärgert', 'wütend', 'nicht okay', 'schlecht'],
  },
  CHANGE: {
    keywords: [
      'ändern',
      'anpassen',
      'wechseln',
      'aktualisieren',
      'umziehen',
      'umzug',
      'adressänderung',
    ],
    changeTypes: ['adresse', 'franchise', 'deckung', 'zahlungsweise', 'bank'],
  },
  CANCELLATION: {
    keywords: [
      'kündigen',
      'stornieren',
      'beenden',
      'auflösen',
      'widerruf',
      'rücktritt',
      'aussteigen',
    ],
  },
  EMERGENCY: {
    keywords: ['notfall', 'sofort', 'dringend', 'hilfe', 'gefahr', 'lebensbedrohlich', 'akut'],
  },
  TECHNICAL: {
    keywords: ['login', 'anmelden', 'passwort', 'zugang', 'app', 'website', 'portal', 'online'],
  },
};

export async function detectIntents(message: string, language: SupportedLanguages = 'en'): Promise<Intent[]> {
  const normalizedMessage = message.toLowerCase();
  const detectedIntents: Intent[] = [];

  // Check against multilingual patterns
  Object.entries(MULTILINGUAL_INTENT_PATTERNS[language]).forEach(([category, patterns]) => {
    const keywordMatches = patterns.keywords.some(keyword => 
      normalizedMessage.includes(keyword.toLowerCase())
    );

    if (keywordMatches) {
      const entities: IntentEntity[] = [];
      
      // Extract insurance types if available
      if (patterns.insuranceTypes) {
        const insuranceType = patterns.insuranceTypes.find(type => 
          normalizedMessage.includes(type.toLowerCase())
        );
        if (insuranceType) {
          entities.push({
            type: 'insurance_type',
            value: insuranceType,
            confidence: 0.9
          });
        }
      }

      // Extract document types if available
      if (patterns.documentTypes) {
        const documentType = patterns.documentTypes.find(type => 
          normalizedMessage.includes(type.toLowerCase())
        );
        if (documentType) {
          entities.push({
            type: 'document_type',
            value: documentType,
            confidence: 0.9
          });
        }
      }

      // Extract amounts
      const amountRegex = /(\d+(?:['']?\d{3})*(?:\.\d{2})?)\s*(?:CHF|Fr\.|Franken|%)/gi;
      const amounts = message.match(amountRegex);
      if (amounts) {
        amounts.forEach(amount => {
          entities.push({
            type: 'amount',
            value: amount,
            confidence: 0.95
          });
        });
      }

      // Extract dates
      const dateRegex = /\d{1,2}\.\d{1,2}\.\d{2,4}|\d{4}-\d{2}-\d{2}/g;
      const dates = message.match(dateRegex);
      if (dates) {
        dates.forEach(date => {
          entities.push({
            type: 'date',
            value: date,
            confidence: 0.95
          });
        });
      }

      detectedIntents.push({
        category: category as any, // TODO: Improve type safety
        confidence: calculateIntentConfidence(normalizedMessage, patterns.keywords),
        entities,
        urgency: determineUrgency(normalizedMessage, language),
        subCategory: determineSubCategory(normalizedMessage, category)
      });
    }
  });

  return detectedIntents.sort((a, b) => b.confidence - a.confidence);
}

export async function processIntent(message: string, language: SupportedLanguages = 'en'): Promise<string> {
  try {
    const intents = await detectIntents(message, language);
    if (intents.length === 0) {
      // Check against basic patterns if no multilingual intent was found
      for (const pattern of intentPatterns) {
        if (pattern.patterns.some(p => message.toLowerCase().includes(p.toLowerCase()))) {
          return pattern.intent;
        }
      }
      return 'general_query';
    }
    
    const topIntent = intents[0];
    return `${topIntent.category.toLowerCase()}${topIntent.subCategory ? '_' + topIntent.subCategory.toLowerCase() : ''}`;
  } catch (error) {
    console.error('Error in processIntent:', error);
    return 'general_query';
  }
}

function calculateIntentConfidence(message: string, patterns: RegExp | string[]): number {
  if (patterns instanceof RegExp) {
    const match = message.match(patterns);
    if (!match) return 0;
    
    // Basis-Konfidenz für einen Match
    let confidence = 0.7;
    
    // Erhöhe Konfidenz basierend auf der Länge des Matches
    confidence += Math.min(0.2, match[0].length / message.length * 0.3);
    
    // Reduziere Konfidenz wenn der Match nur ein kleiner Teil der Nachricht ist
    if (match[0].length < message.length * 0.3) {
      confidence *= 0.8;
    }
    
    return Math.min(0.95, confidence);
  } else {
    // Für String-Arrays
    const matches = patterns.filter(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    ).length;
    return Math.min(matches / patterns.length, 0.95);
  }
}

function determineUrgency(message: string, language: SupportedLanguages): 'low' | 'medium' | 'high' {
  const normalizedMessage = message.toLowerCase();
  
  if (URGENCY_INDICATORS.high[language].some(indicator => 
    normalizedMessage.includes(indicator.toLowerCase())
  )) {
    return 'high';
  }
  
  if (URGENCY_INDICATORS.medium[language].some(indicator => 
    normalizedMessage.includes(indicator.toLowerCase())
  )) {
    return 'medium';
  }
  
  return 'low';
}

function determineSubCategory(message: string, category: string): string | undefined {
  const insuranceType = extractInsuranceTypes(message)[0];
  const documentType = extractDocumentTypes(message)[0];

  switch (category) {
    case 'INFORMATION':
    case 'PRICE':
    case 'COVERAGE':
      return insuranceType;
    case 'DOCUMENT':
      return documentType;
    default:
      return undefined;
  }
}

function extractEntities(message: string, type: string): IntentEntity[] {
  const entities: IntentEntity[] = [];
  
  switch (type) {
    case 'insurance_type':
      extractInsuranceTypes(message).forEach(value => {
        entities.push({
          type: 'insurance_type',
          value,
          confidence: 0.9
        });
      });
      break;
    case 'document_type':
      extractDocumentTypes(message).forEach(value => {
        entities.push({
          type: 'document_type',
          value,
          confidence: 0.9
        });
      });
      break;
  }
  
  return entities;
}

export function getResponseForIntent(intent: string, language: string = 'de'): string {
  // TODO: Implementiere Intent-basierte Antworten
  return 'Ich verstehe Ihr Anliegen. Wie kann ich Ihnen weiterhelfen?';
}

// Helper functions for specific extractions
export function extractInsuranceTypes(message: string): string[] {
  const insuranceTypes = [
    'krankenversicherung',
    'unfallversicherung',
    'haftpflichtversicherung',
    'hausratversicherung',
    'lebensversicherung',
    'rechtsschutzversicherung'
  ];
  
  return insuranceTypes.filter(type => 
    message.toLowerCase().includes(type.toLowerCase())
  );
}

export function extractDocumentTypes(message: string): string[] {
  const documentTypes = [
    'vertrag',
    'police',
    'rechnung',
    'quittung',
    'schadensmeldung',
    'unfallbericht'
  ];
  
  return documentTypes.filter(type => 
    message.toLowerCase().includes(type.toLowerCase())
  );
}

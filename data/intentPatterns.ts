import { SupportedLanguages } from '@/types';

export const MULTILINGUAL_INTENT_PATTERNS: Record<SupportedLanguages, Record<string, {
  keywords: string[];
  insuranceTypes?: string[];
  documentTypes?: string[];
}>> = {
  de: {
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
    DOCUMENT: {
      keywords: [
        'dokument',
        'upload',
        'hochladen',
        'datei',
        'unterlagen',
        'formular',
      ],
      documentTypes: [
        'versicherungsschein',
        'police',
        'rechnung',
        'quittung',
        'antrag',
        'kündigung',
      ],
    },
  },
  en: {
    INFORMATION: {
      keywords: [
        'information',
        'info',
        'details',
        'explain',
        'how does it work',
        'what is',
        'means',
        'understand',
        'know',
      ],
      insuranceTypes: [
        'health insurance',
        'household',
        'liability',
        'car',
        'life',
        'accident',
        'legal',
      ],
    },
    DOCUMENT: {
      keywords: [
        'document',
        'upload',
        'file',
        'papers',
        'form',
      ],
      documentTypes: [
        'insurance policy',
        'policy',
        'invoice',
        'receipt',
        'application',
        'cancellation',
      ],
    },
  },
  fr: {
    // French patterns...
    INFORMATION: {
      keywords: [
        'information',
        'info',
        'détails',
        'expliquer',
        'comment ça marche',
        'qu\'est-ce que',
        'signifie',
        'comprendre',
        'savoir',
      ],
    },
    DOCUMENT: {
      keywords: [
        'document',
        'télécharger',
        'fichier',
        'papiers',
        'formulaire',
      ],
    },
  },
  it: {
    // Italian patterns...
    INFORMATION: {
      keywords: [
        'informazione',
        'info',
        'dettagli',
        'spiegare',
        'come funziona',
        'che cosa è',
        'significa',
        'capire',
        'sapere',
      ],
    },
    DOCUMENT: {
      keywords: [
        'documento',
        'caricare',
        'file',
        'carta',
        'modulo',
      ],
    },
  },
};

export const URGENCY_INDICATORS = {
  high: {
    de: ['sofort', 'dringend', 'notfall', 'eilig'],
    en: ['immediate', 'urgent', 'emergency', 'asap'],
    fr: ['immédiat', 'urgent', 'urgence', 'pressé'],
    it: ['immediato', 'urgente', 'emergenza', 'urgenza'],
  },
  medium: {
    de: ['bald', 'zeitnah', 'wichtig'],
    en: ['soon', 'important', 'timely'],
    fr: ['bientôt', 'important', 'rapide'],
    it: ['presto', 'importante', 'tempestivo'],
  },
};

export const intentPatterns = [
  {
    intent: 'upload_document',
    patterns: [
      'hochladen',
      'upload',
      'dokument',
      'datei',
      'pdf',
      'scan',
    ],
  },
  {
    intent: 'insurance_info',
    patterns: [
      'versicherung',
      'police',
      'deckung',
      'leistungen',
      'prämie',
    ],
  },
  {
    intent: 'claim',
    patterns: [
      'schaden',
      'unfall',
      'melden',
      'schadenfall',
      'beschädigung',
    ],
  },
  {
    intent: 'general_query',
    patterns: [
      'frage',
      'hilfe',
      'unterstützung',
      'wie',
      'was',
      'wann',
    ],
  },
  {
    intent: 'schedule_appointment',
    patterns: [
      'termin',
      'terminvereinbarung',
      'termin vereinbaren',
      'ich will einen termin',
      'termin buchen',
      'beratungstermin',
      'gespräch vereinbaren'
    ],
  },
]; 
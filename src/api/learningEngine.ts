import { FeedbackService } from './feedbackService';
import { 
  ClassificationFeedback, 
  KeywordUpdate,
  LearningCycle 
} from '../types/feedback';

interface KeywordData {
  keyword: string;
  weight: number;
}

interface DocumentTypeKeywords {
  [documentType: string]: KeywordData[];
}

interface LearningResult {
  cycleId: string;
  appliedFeedbackCount: number;
  keywords: {
    added: KeywordUpdate[];
    removed: KeywordUpdate[];
    adjusted: KeywordUpdate[];
  };
  affectedDocumentTypes: string[];
}

/**
 * Engine zur Verarbeitung von Feedback und Verbesserung des Klassifizierungssystems
 */
export class LearningEngine {
  private feedbackService: FeedbackService;
  private currentKeywords: DocumentTypeKeywords;
  
  constructor(
    feedbackService: FeedbackService,
    initialKeywords: DocumentTypeKeywords = {}
  ) {
    this.feedbackService = feedbackService;
    this.currentKeywords = initialKeywords;
  }

  /**
   * Lädt die aktuelle Keyword-Konfiguration 
   * (in einer echten Implementierung würde dies aus einer externen Quelle geladen)
   */
  public async loadCurrentKeywords(): Promise<DocumentTypeKeywords> {
    // In einer echten Implementierung würde hier die Konfiguration aus einer Datenbank oder Datei geladen
    // Für dieses Beispiel verwenden wir Mockup-Daten
    
    this.currentKeywords = {
      'Rechnung': [
        { keyword: 'rechnung', weight: 1.0 },
        { keyword: 'invoice', weight: 0.9 },
        { keyword: 'zahlung', weight: 0.7 },
        { keyword: 'betrag', weight: 0.6 },
      ],
      'Vertrag': [
        { keyword: 'vertrag', weight: 1.0 },
        { keyword: 'contract', weight: 0.9 },
        { keyword: 'vereinbarung', weight: 0.8 },
        { keyword: 'konditionen', weight: 0.6 },
      ],
      'Angebot': [
        { keyword: 'angebot', weight: 1.0 },
        { keyword: 'quote', weight: 0.9 },
        { keyword: 'preis', weight: 0.7 },
      ],
      'Mahnung': [
        { keyword: 'mahnung', weight: 1.0 },
        { keyword: 'reminder', weight: 0.9 },
        { keyword: 'zahlungserinnerung', weight: 0.8 },
        { keyword: 'überfällig', weight: 0.7 },
      ]
    };
    
    return this.currentKeywords;
  }

  /**
   * Startet einen Lernzyklus basierend auf gesammeltem Feedback
   */
  public async startLearningCycle(userId: string, notes?: string): Promise<LearningResult | null> {
    // 1. Lernzyklus in der Datenbank initialisieren
    const cycle = await this.feedbackService.startLearningCycle(userId, notes);
    if (!cycle) {
      console.error('Fehler beim Starten des Lernzyklus');
      return null;
    }

    // 2. Feedback abrufen, das noch nicht angewendet wurde
    const pendingFeedback = await this.feedbackService.getPendingFeedback(500);
    if (pendingFeedback.length === 0) {
      console.log('Kein austehendes Feedback zum Verarbeiten gefunden');
      await this.feedbackService.updateLearningCycleStatus(
        cycle.id, 
        'completed', 
        0, 
        { keywords_added: 0, keywords_removed: 0, keywords_adjusted: 0, affected_document_types: [] }
      );
      return {
        cycleId: cycle.id,
        appliedFeedbackCount: 0,
        keywords: { added: [], removed: [], adjusted: [] },
        affectedDocumentTypes: []
      };
    }

    // 3. Aktuelle Keyword-Konfiguration laden
    await this.loadCurrentKeywords();

    // 4. Lernzyklus als "in Bearbeitung" markieren
    await this.feedbackService.updateLearningCycleStatus(
      cycle.id, 
      'in_progress', 
      0, 
      { keywords_added: 0, keywords_removed: 0, keywords_adjusted: 0, affected_document_types: [] }
    );

    // 5. Feedback verarbeiten und Lernalgorithmus anwenden
    const result = await this.applyLearningAlgorithm(pendingFeedback, cycle);
    
    // 6. Feedback als angewendet markieren
    await this.feedbackService.markFeedbackAsApplied(
      pendingFeedback.map(f => f.id),
      cycle.id
    );

    // 7. Lernzyklus als abgeschlossen markieren
    await this.feedbackService.updateLearningCycleStatus(
      cycle.id, 
      'completed', 
      pendingFeedback.length, 
      { 
        keywords_added: result.keywords.added.length, 
        keywords_removed: result.keywords.removed.length, 
        keywords_adjusted: result.keywords.adjusted.length, 
        affected_document_types: result.affectedDocumentTypes 
      }
    );

    return result;
  }

  /**
   * Wendet den Lernalgorithmus auf das gesammelte Feedback an
   */
  private async applyLearningAlgorithm(
    feedback: ClassificationFeedback[],
    cycle: LearningCycle
  ): Promise<LearningResult> {
    // Ergebnis-Objekt initialisieren
    const result: LearningResult = {
      cycleId: cycle.id,
      appliedFeedbackCount: feedback.length,
      keywords: {
        added: [],
        removed: [],
        adjusted: []
      },
      affectedDocumentTypes: []
    };

    // Set für betroffene Dokumenttypen
    const affectedTypes = new Set<string>();

    // 1. Feedback nach Dokumenttyp gruppieren
    const feedbackByType: Record<string, ClassificationFeedback[]> = {};
    
    for (const item of feedback) {
      const type = item.corrected_classification;
      if (!feedbackByType[type]) {
        feedbackByType[type] = [];
      }
      feedbackByType[type].push(item);
      
      // Ursprünglichen Typ auch als betroffen markieren, wenn er falsch war
      if (item.original_classification !== item.corrected_classification) {
        affectedTypes.add(item.original_classification);
      }
      
      affectedTypes.add(type);
    }

    // 2. Für jeden Dokumenttyp Schlüsselwörter analysieren
    for (const [documentType, feedbackItems] of Object.entries(feedbackByType)) {
      // Sicherstellen, dass der Dokumenttyp in der Keyword-Konfiguration existiert
      if (!this.currentKeywords[documentType]) {
        this.currentKeywords[documentType] = [];
      }

      // Potenzielle neue Schlüsselwörter identifizieren
      const documentDetails = await this.getDocumentDetailsForFeedback(feedbackItems);
      
      // 2.1 Häufige Wörter in korrekt klassifizierten Dokumenten dieses Typs finden
      const wordFrequency = this.analyzeWordFrequency(documentDetails, documentType);

      // 2.2 Neue Schlüsselwörter hinzufügen
      for (const [word, frequency] of Object.entries(wordFrequency)) {
        if (frequency > 2) { // Nur Wörter, die mehr als zweimal vorkommen
          const existingKeyword = this.currentKeywords[documentType].find(k => k.keyword === word);
          
          if (!existingKeyword && word.length > 3) { // Nur Wörter mit mehr als 3 Buchstaben
            // Neues Schlüsselwort hinzufügen
            const weight = Math.min(0.7, frequency / 10); // Gewicht basierend auf Häufigkeit
            this.currentKeywords[documentType].push({ keyword: word, weight });
            
            // Änderung protokollieren
            const update: KeywordUpdate = {
              id: '', // Wird von der Datenbank generiert
              learning_cycle_id: cycle.id,
              document_type: documentType,
              keyword: word,
              action: 'added',
              previous_weight: null,
              new_weight: weight,
              update_timestamp: new Date().toISOString()
            };
            
            result.keywords.added.push(update);
            await this.feedbackService.logKeywordUpdate(
              cycle.id, documentType, word, 'added', null, weight
            );
          } else if (existingKeyword) {
            // Bestehendes Schlüsselwort anpassen (Gewicht erhöhen)
            const previousWeight = existingKeyword.weight;
            // Gewicht um 10% erhöhen, bis maximal 1.0
            const newWeight = Math.min(1.0, previousWeight * 1.1);
            
            if (newWeight > previousWeight) {
              existingKeyword.weight = newWeight;
              
              // Änderung protokollieren
              const update: KeywordUpdate = {
                id: '', // Wird von der Datenbank generiert
                learning_cycle_id: cycle.id,
                document_type: documentType,
                keyword: word,
                action: 'weight_adjusted',
                previous_weight: previousWeight,
                new_weight: newWeight,
                update_timestamp: new Date().toISOString()
              };
              
              result.keywords.adjusted.push(update);
              await this.feedbackService.logKeywordUpdate(
                cycle.id, documentType, word, 'weight_adjusted', previousWeight, newWeight
              );
            }
          }
        }
      }

      // 2.3 Schlüsselwörter mit geringer Relevanz identifizieren und entfernen
      const incorrectFeedback = feedbackItems.filter(
        f => f.original_classification !== f.corrected_classification && 
             f.original_classification === documentType
      );
      
      if (incorrectFeedback.length > 0) {
        const incorrectDocumentDetails = await this.getDocumentDetailsForFeedback(incorrectFeedback);
        const wordsToRemove = this.identifyMisleadingKeywords(incorrectDocumentDetails, documentType);
        
        for (const word of wordsToRemove) {
          const keywordIndex = this.currentKeywords[documentType].findIndex(k => k.keyword === word);
          
          if (keywordIndex !== -1) {
            const previousWeight = this.currentKeywords[documentType][keywordIndex].weight;
            
            // Schlüsselwort entfernen
            this.currentKeywords[documentType].splice(keywordIndex, 1);
            
            // Änderung protokollieren
            const update: KeywordUpdate = {
              id: '', // Wird von der Datenbank generiert
              learning_cycle_id: cycle.id,
              document_type: documentType,
              keyword: word,
              action: 'removed',
              previous_weight: previousWeight,
              new_weight: null,
              update_timestamp: new Date().toISOString()
            };
            
            result.keywords.removed.push(update);
            await this.feedbackService.logKeywordUpdate(
              cycle.id, documentType, word, 'removed', previousWeight, null
            );
          }
        }
      }
    }

    // Betroffene Dokumenttypen zum Ergebnis hinzufügen
    result.affectedDocumentTypes = Array.from(affectedTypes);

    return result;
  }

  /**
   * Abrufen von Dokumentdetails für eine Liste von Feedback-Einträgen
   * In einer realen Implementierung würden hier die Dokumente aus einer Datenbank abgerufen
   */
  private async getDocumentDetailsForFeedback(
    feedback: ClassificationFeedback[]
  ): Promise<{ documentName: string; documentId: string; feedback: ClassificationFeedback }[]> {
    // Simulierter Abruf von Dokumentdetails
    // In einer echten Implementierung würden hier die Dokumente aus einer Datenbank abgerufen
    
    const result: { documentName: string; documentId: string; feedback: ClassificationFeedback }[] = [];
    
    for (const fb of feedback) {
      const classification = await this.feedbackService.getClassificationById(fb.classification_id);
      
      if (classification) {
        result.push({
          documentName: classification.document_name,
          documentId: classification.document_id,
          feedback: fb
        });
      }
    }
    
    return result;
  }

  /**
   * Analysiert die Häufigkeit von Wörtern in Dokumentnamen
   */
  private analyzeWordFrequency(
    documents: { documentName: string; documentId: string; feedback: ClassificationFeedback }[],
    documentType: string
  ): Record<string, number> {
    const wordFrequency: Record<string, number> = {};
    
    // Nur korrekt klassifizierte Dokumente berücksichtigen
    const correctDocuments = documents.filter(
      doc => doc.feedback.corrected_classification === documentType
    );
    
    for (const doc of correctDocuments) {
      // Dokumentnamen in Wörter zerlegen
      const words = doc.documentName.toLowerCase()
        .replace(/[^\wäöüß]/g, ' ') // Sonderzeichen durch Leerzeichen ersetzen
        .split(/\s+/) // An Leerzeichen teilen
        .filter(word => word.length > 0); // Leere Zeichenketten entfernen
      
      // Wörter zählen
      for (const word of words) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    }
    
    return wordFrequency;
  }

  /**
   * Identifiziert irreführende Schlüsselwörter in falsch klassifizierten Dokumenten
   */
  private identifyMisleadingKeywords(
    documents: { documentName: string; documentId: string; feedback: ClassificationFeedback }[],
    incorrectType: string
  ): string[] {
    const misleadingWords: Set<string> = new Set();
    
    // Aktuellen Schlüsselwortliste für den falschen Typ abrufen
    const currentKeywords = this.currentKeywords[incorrectType] || [];
    
    for (const doc of documents) {
      const documentName = doc.documentName.toLowerCase();
      
      // Prüfen, welche Schlüsselwörter in diesem falsch klassifizierten Dokument vorkommen
      for (const keywordData of currentKeywords) {
        if (documentName.includes(keywordData.keyword)) {
          misleadingWords.add(keywordData.keyword);
        }
      }
    }
    
    return Array.from(misleadingWords);
  }

  /**
   * Speichert die aktualisierte Keyword-Konfiguration
   */
  public async saveUpdatedKeywords(): Promise<boolean> {
    // In einer echten Implementierung würde die Konfiguration in eine Datenbank oder Datei gespeichert
    console.log('Speichern der aktualisierten Keywords:', this.currentKeywords);
    return true;
  }
} 
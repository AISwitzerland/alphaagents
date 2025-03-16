import { supabase } from '../lib/supabase';
import { ClassificationFeedback, LearningCycle } from '../types/feedback';

export class LearningEngine {
  /**
   * Startet einen neuen Lernzyklus basierend auf ausgewähltem Feedback
   * @param feedbackItems Array von Feedback-Elementen, die in diesen Lernzyklus einbezogen werden sollen
   * @returns Ergebnis des Lernzyklus
   */
  async startLearningCycle(feedbackItems: ClassificationFeedback[]): Promise<{
    cycleId: string;
    appliedFeedbackCount: number;
    keywords: {
      added: string[];
      removed: string[];
      adjusted: string[];
    };
    affectedDocumentTypes: string[];
  }> {
    try {
      console.log(`Starte Lernzyklus mit ${feedbackItems.length} Feedback-Elementen`);
      
      // 1. Erstelle einen neuen Lernzyklus-Eintrag in der Datenbank
      const { data: cycleData, error: cycleError } = await supabase
        .from('learning_cycles')
        .insert({
          cycle_timestamp: new Date().toISOString(),
          status: 'in_progress',
          applied_feedback_count: feedbackItems.length,
          performed_by_user_id: (await supabase.auth.getUser()).data.user?.id || 'unknown',
          cycle_notes: `Automatischer Lernzyklus mit ${feedbackItems.length} Feedback-Elementen`
        })
        .select()
        .single();
      
      if (cycleError) {
        throw new Error(`Fehler beim Erstellen des Lernzyklus: ${cycleError.message}`);
      }
      
      const cycleId = cycleData.id;
      
      // 2. Analysiere das Feedback und leite Änderungen für Klassifizierungsalgorithmus ab
      const keywordsToAdd: string[] = [];
      const keywordsToRemove: string[] = [];
      const keywordsToAdjust: string[] = [];
      const affectedDocumentTypes = new Set<string>();
      
      // Durchlaufe alle Feedback-Elemente und extrahiere Änderungsvorschläge
      for (const feedback of feedbackItems) {
        // Dokumenttyp zur Liste der betroffenen Typen hinzufügen
        if (feedback.suggested_document_type) {
          affectedDocumentTypes.add(feedback.suggested_document_type);
        }
        if (feedback.detected_document_type) {
          affectedDocumentTypes.add(feedback.detected_document_type);
        }
        
        // Basierend auf Feedback-Typ Änderungen ableiten
        if (feedback.feedback_type === 'wrong_classification') {
          // Wenn falsch klassifiziert, analysiere Schlüsselwörter
          if (feedback.document_keywords) {
            const keywords = feedback.document_keywords.split(',').map(k => k.trim());
            
            // Logik zur Bestimmung welche Keywords hinzugefügt/entfernt werden sollten
            // Dies ist eine vereinfachte Implementierung und sollte in der Praxis komplexer sein
            for (const keyword of keywords) {
              if (Math.random() > 0.7) { // Simulierte Entscheidung
                if (Math.random() > 0.5) {
                  keywordsToAdd.push(`${keyword}_${feedback.suggested_document_type}`);
                } else {
                  keywordsToRemove.push(`${keyword}_${feedback.detected_document_type}`);
                }
              } else {
                keywordsToAdjust.push(keyword);
              }
            }
          }
        }
        
        // 3. Markiere das Feedback als in einem Lernzyklus angewendet
        await supabase
          .from('classification_feedback')
          .update({
            applied_to_learning: true,
            learning_cycle_id: cycleId
          })
          .eq('id', feedback.id);
      }
      
      // 4. Speichere die Änderungszusammenfassung in der Datenbank
      const changesSummary = {
        keywords_added: keywordsToAdd.length,
        keywords_removed: keywordsToRemove.length,
        keywords_adjusted: keywordsToAdjust.length,
        affected_document_types: Array.from(affectedDocumentTypes)
      };
      
      await supabase
        .from('learning_cycles')
        .update({
          status: 'completed',
          changes_summary: changesSummary
        })
        .eq('id', cycleId);
      
      console.log(`Lernzyklus ${cycleId} abgeschlossen`);
      
      // 5. Ergebnis zurückgeben
      return {
        cycleId,
        appliedFeedbackCount: feedbackItems.length,
        keywords: {
          added: keywordsToAdd,
          removed: keywordsToRemove,
          adjusted: keywordsToAdjust
        },
        affectedDocumentTypes: Array.from(affectedDocumentTypes)
      };
    } catch (error) {
      console.error('Fehler beim Ausführen des Lernzyklus:', error);
      throw error;
    }
  }
  
  /**
   * Wendet die Ergebnisse eines Lernzyklus auf den Klassifizierungsalgorithmus an
   * @param cycleId ID des Lernzyklus
   */
  async applyLearningCycleResults(cycleId: string): Promise<void> {
    try {
      // Hier würde die Logik implementiert werden, um die Änderungen
      // tatsächlich auf den Klassifizierungsalgorithmus anzuwenden
      console.log(`Wende Ergebnisse des Lernzyklus ${cycleId} an`);
      
      // Status des Lernzyklus auf "applied" aktualisieren
      await supabase
        .from('learning_cycles')
        .update({
          status: 'applied'
        })
        .eq('id', cycleId);
    } catch (error) {
      console.error(`Fehler beim Anwenden des Lernzyklus ${cycleId}:`, error);
      throw error;
    }
  }
} 
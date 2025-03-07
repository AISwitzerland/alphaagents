/**
 * Integration der verbesserten Dokumentklassifizierung
 * 
 * Diese Datei dient als Brücke zwischen der bestehenden Dokumentklassifizierung
 * und der verbesserten Version in enhancedDocumentClassification.ts.
 */

import { enhancedFilenameClassification, improvedDocumentTypeDecision, logClassificationResult } from './enhancedDocumentClassification';

/**
 * Integriert die verbesserte dateinamenbasierte Klassifizierung in den bestehenden Prozess
 * 
 * @param filename Der Dateiname des Dokuments
 * @returns Ein Objekt mit dem erkannten Typ und der Konfidenz
 */
export function getDocumentTypeFromFilename(filename: string): { type: string, confidence: number } {
  // Ruft die verbesserte Klassifizierung auf
  return enhancedFilenameClassification(filename);
}

/**
 * Integriert die verbesserte Entscheidungslogik in den bestehenden Prozess
 * 
 * @param filenameType Der durch den Dateinamen erkannte Dokumenttyp
 * @param filenameConfidence Die Konfidenz der dateinamenbasierten Erkennung
 * @param aiType Der durch die KI erkannte Dokumenttyp
 * @param aiConfidence Die Konfidenz der KI-basierten Erkennung
 * @returns Der finale Dokumenttyp
 */
export function determineDocumentType(
  filenameType: string,
  filenameConfidence: number,
  aiType: string,
  aiConfidence: number
): string {
  const filenameResult = { type: filenameType, confidence: filenameConfidence };
  const aiResult = { type: aiType, confidence: aiConfidence };
  
  const decision = improvedDocumentTypeDecision(filenameResult, aiResult);
  
  // Protokolliere das Ergebnis (ohne await, da wir keine Promise zurückgeben wollen)
  logClassificationResult('temp-id', filenameResult, aiResult, decision)
    .catch(error => console.error('Error logging classification result:', error));
  
  return decision.type;
}

/**
 * Hilfsfunktion zur Protokollierung der Klassifizierungsergebnisse
 * 
 * @param documentId Die ID des Dokuments
 * @param filenameType Der durch den Dateinamen erkannte Dokumenttyp
 * @param filenameConfidence Die Konfidenz der dateinamenbasierten Erkennung
 * @param aiType Der durch die KI erkannte Dokumenttyp
 * @param aiConfidence Die Konfidenz der KI-basierten Erkennung
 * @param finalType Der finale Dokumenttyp
 */
export function logDocumentClassification(
  documentId: string,
  filenameType: string,
  filenameConfidence: number,
  aiType: string,
  aiConfidence: number,
  finalType: string
): void {
  const filenameResult = { type: filenameType, confidence: filenameConfidence };
  const aiResult = { type: aiType, confidence: aiConfidence };
  const finalDecision = { 
    type: finalType, 
    source: filenameType === aiType ? 'both' : 
            (finalType === filenameType ? 'filename' : 
             (finalType === aiType ? 'ai' : 'default')),
    confidence: finalType === filenameType ? filenameConfidence : 
                (finalType === aiType ? aiConfidence : 0)
  };
  
  // Protokolliere das Ergebnis (ohne await, da wir keine Promise zurückgeben wollen)
  logClassificationResult(documentId, filenameResult, aiResult, finalDecision)
    .catch(error => console.error('Error logging classification result:', error));
}

/**
 * Anleitung zur Integration in die bestehende Codebase
 * 
 * Um die verbesserte Dokumentklassifizierung in die bestehende Codebase zu integrieren,
 * folgen Sie diesen Schritten:
 * 
 * 1. In utils/file.ts:
 *    - Importieren Sie die Funktionen aus dieser Datei:
 *      ```
 *      import { getDocumentTypeFromFilename, determineDocumentType, logDocumentClassification } from './documentClassificationIntegration';
 *      ```
 * 
 * 2. Ersetzen Sie die bestehende dateinamenbasierte Klassifizierung:
 *    - Suchen Sie nach dem Code, der den Dokumenttyp aus dem Dateinamen bestimmt
 *    - Ersetzen Sie ihn durch einen Aufruf von `getDocumentTypeFromFilename(filename)`
 * 
 * 3. Ersetzen Sie die Entscheidungslogik:
 *    - Suchen Sie nach dem Code, der zwischen dateinamenbasierter und KI-basierter Klassifizierung entscheidet
 *    - Ersetzen Sie ihn durch einen Aufruf von `determineDocumentType(filenameType, filenameConfidence, aiType, aiConfidence)`
 * 
 * 4. Fügen Sie die Protokollierung hinzu:
 *    - Nach der finalen Entscheidung über den Dokumenttyp
 *    - Rufen Sie `logDocumentClassification(documentId, filenameType, filenameConfidence, aiType, aiConfidence, finalType)` auf
 */ 
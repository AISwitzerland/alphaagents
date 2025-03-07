/**
 * Verbesserte Dokumentklassifizierung
 * 
 * Diese Datei enthält verbesserte Funktionen zur Dokumentklassifizierung,
 * insbesondere für die dateinamenbasierte Erkennung und die Entscheidungslogik
 * zwischen dateinamenbasierter und KI-basierter Klassifizierung.
 */

/**
 * Erkennt den Dokumenttyp basierend auf dem Dateinamen mit verbesserter Schlüsselworterkennung
 * 
 * @param filename Der Dateiname des Dokuments
 * @returns Ein Objekt mit dem erkannten Typ und der Konfidenz
 */
export function enhancedFilenameClassification(filename: string): { type: string, confidence: number } {
  // Normalisiere den Dateinamen (Kleinbuchstaben, ohne Dateiendung)
  const normalizedName = filename.toLowerCase();
  const nameWithoutExtension = normalizedName.split('.').slice(0, -1).join('.');
  
  // Spezifische Schlüsselwörter für Dokumenttypen mit Konfidenzwerten
  const keywordMap: Record<string, { type: string, confidence: number }> = {
    // Vertragsänderungen und Kündigungen
    'kündigung': { type: 'contract_change', confidence: 0.9 },
    'kuendigung': { type: 'contract_change', confidence: 0.9 },
    'änderung': { type: 'contract_change', confidence: 0.85 },
    'aenderung': { type: 'contract_change', confidence: 0.85 },
    'widerruf': { type: 'contract_change', confidence: 0.85 },
    'wechsel': { type: 'contract_change', confidence: 0.8 },
    'vertrag': { type: 'contract', confidence: 0.7 },
    
    // Unfälle
    'unfall': { type: 'accident', confidence: 0.9 },
    'kollision': { type: 'accident', confidence: 0.85 },
    'crash': { type: 'accident', confidence: 0.85 },
    'zusammenstoß': { type: 'accident', confidence: 0.85 },
    'zusammenstoss': { type: 'accident', confidence: 0.85 },
    
    // Schäden
    'schaden': { type: 'damage', confidence: 0.9 },
    'beschädigung': { type: 'damage', confidence: 0.85 },
    'beschaedigung': { type: 'damage', confidence: 0.85 },
    'defekt': { type: 'damage', confidence: 0.8 },
    'kaputt': { type: 'damage', confidence: 0.8 },
    
    // Rechnungen
    'rechnung': { type: 'invoice', confidence: 0.9 },
    'invoice': { type: 'invoice', confidence: 0.9 },
    'mahnung': { type: 'invoice', confidence: 0.85 },
    'zahlung': { type: 'invoice', confidence: 0.8 },
    'betrag': { type: 'invoice', confidence: 0.7 },
    'kosten': { type: 'invoice', confidence: 0.7 },
    
    // Anträge
    'antrag': { type: 'application', confidence: 0.9 },
    'bewerbung': { type: 'application', confidence: 0.85 },
    'anfrage': { type: 'application', confidence: 0.8 },
    
    // Bestätigungen
    'bestätigung': { type: 'confirmation', confidence: 0.9 },
    'bestaetigung': { type: 'confirmation', confidence: 0.9 },
    'zusage': { type: 'confirmation', confidence: 0.85 },
    
    // Weitere Typen können hier hinzugefügt werden
  };
  
  // Prüfe auf Schlüsselwörter im Dateinamen
  for (const [keyword, result] of Object.entries(keywordMap)) {
    if (nameWithoutExtension.includes(keyword)) {
      return result;
    }
  }
  
  // Wenn kein Schlüsselwort gefunden wurde, gib "misc" mit niedriger Konfidenz zurück
  return { type: 'misc', confidence: 0.1 };
}

/**
 * Verbesserte Entscheidungslogik zwischen dateinamenbasierter und KI-basierter Klassifizierung
 * 
 * @param filenameResult Das Ergebnis der dateinamenbasierten Klassifizierung
 * @param aiResult Das Ergebnis der KI-basierten Klassifizierung
 * @returns Ein Objekt mit dem finalen Typ, der Quelle und der Konfidenz
 */
export function improvedDocumentTypeDecision(
  filenameResult: { type: string, confidence: number },
  aiResult: { type: string, confidence: number }
): { type: string, source: 'filename' | 'ai' | 'both' | 'default', confidence: number } {
  
  // Wenn beide Methoden zum gleichen Ergebnis kommen
  if (filenameResult.type === aiResult.type) {
    return { 
      type: filenameResult.type, 
      source: 'both',
      confidence: Math.max(filenameResult.confidence, aiResult.confidence)
    };
  }
  
  // Wenn der Dateiname sehr eindeutig ist (z.B. "Kündigung")
  if (filenameResult.confidence > 0.8) {
    // KI muss SEHR sicher sein, um den Dateinamen zu überschreiben
    if (aiResult.confidence > 0.95) {
      return { type: aiResult.type, source: 'ai', confidence: aiResult.confidence };
    } else {
      return { type: filenameResult.type, source: 'filename', confidence: filenameResult.confidence };
    }
  }
  
  // Wenn der Dateiname mäßig eindeutig ist
  if (filenameResult.confidence > 0.5) {
    // KI braucht gute Konfidenz
    if (aiResult.confidence > 0.8) {
      return { type: aiResult.type, source: 'ai', confidence: aiResult.confidence };
    } else {
      return { type: filenameResult.type, source: 'filename', confidence: filenameResult.confidence };
    }
  }
  
  // Bei schwachen Dateinamenhinweisen
  if (aiResult.confidence > 0.6) {
    return { type: aiResult.type, source: 'ai', confidence: aiResult.confidence };
  } else {
    return { type: 'misc', source: 'default', confidence: 0 };
  }
}

/**
 * Protokolliert das Klassifizierungsergebnis für spätere Analyse
 * 
 * @param documentId Die ID des Dokuments
 * @param filenameResult Das Ergebnis der dateinamenbasierten Klassifizierung
 * @param aiResult Das Ergebnis der KI-basierten Klassifizierung
 * @param finalDecision Die endgültige Entscheidung
 */
export async function logClassificationResult(
  documentId: string,
  filenameResult: { type: string, confidence: number },
  aiResult: { type: string, confidence: number },
  finalDecision: { type: string, source: string, confidence: number }
) {
  try {
    // Hier würde die Logik zur Speicherung in Supabase oder einer anderen Datenbank stehen
    console.log('Classification result logged:', {
      document_id: documentId,
      filename_type: filenameResult.type,
      filename_confidence: filenameResult.confidence,
      ai_type: aiResult.type,
      ai_confidence: aiResult.confidence,
      final_type: finalDecision.type,
      decision_source: finalDecision.source,
      timestamp: new Date().toISOString()
    });
    
    // In einer vollständigen Implementierung würde hier der Eintrag in die Datenbank gespeichert werden
  } catch (error) {
    console.error('Error logging classification result:', error);
  }
} 
/**
 * Zentrale Konfigurationsdatei für die Anwendung
 */

export const config = {
  openai: {
    model: 'gpt-4o',  // Model für Bildverarbeitung und Dokumentenanalyse
    textModel: 'gpt-4',             // Model für Textverarbeitung
    embeddingModel: 'text-embedding-ada-002'  // Model für Embeddings
  },
  
  // Feature-Flags für die graduelle Einführung neuer Funktionen
  features: {
    documentDetection: {
      useAI: true,                // KI-Erkennung aktivieren/deaktivieren
      highConfidenceThreshold: 0.8,  // Ab diesem Wert gilt die KI-Erkennung als sehr zuverlässig
      lowConfidenceThreshold: 0.5,   // Unter diesem Wert wird auf Dateinamenerkennung zurückgegriffen
      timeout: 5000,                 // Timeout für KI-Anfragen in ms
      
      // PDF-zu-Bild-Konvertierungseinstellungen
      pdfConversion: {
        enabled: true,             // PDF-zu-Bild-Konvertierung aktivieren/deaktivieren
        compareBothMethods: true,  // Aktiviert Vergleichslogging zwischen beiden Methoden
        fallbackToOriginal: true   // Bei Konvertierungsfehler auf Original-PDF zurückgreifen
      }
    }
  },
  
  // Logging-Konfiguration
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    enableConsole: true,
    enableFile: process.env.NODE_ENV === 'production',
    fileLogPath: './logs/app.log',
    
    // Spezielle Logging-Einstellungen für Dokumentenklassifizierungsvergleiche
    classificationComparison: {
      enabled: true,               // Aktiviert das visuelle Vergleichslogging
      storeResults: false          // Speichert Vergleichsergebnisse (Für zukünftige DB-Integration)
    }
  }
};

// Typ-Definitionen für die Konfiguration
export type Config = typeof config;

// Exportiere den Konfigurationstyp für TypeScript
export default config; 
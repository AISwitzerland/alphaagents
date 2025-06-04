// Optimierter Hybrid-Ansatz: Best of Both Worlds

interface OptimizedTopicDetection {
  
  // Level 1: Ultra-Fast Pattern (1ms) - für 80% der Fälle
  detectByPatterns(message: string): { topic: string; confidence: number } {
    // Erweiterte Patterns für häufige Fälle
    const patterns = {
      quote_high_confidence: [
        /ich\s+(möchte|will|brauche)\s+.*(versicherung|offerte|angebot)/i,
        /reiseversicherung|krankenversicherung|haftpflichtversicherung/i
      ],
      appointment_high_confidence: [
        /termin\s+(vereinbaren|buchen|reservieren)/i,
        /wann\s+(haben\s+sie|sind\s+sie)\s+zeit/i
      ]
    }
    
    // Nur bei hoher Confidence → Direkt verwenden
    // Bei niedriger Confidence → GPT-4
  }
  
  // Level 2: Smart GPT-4 (800ms) - für 20% der komplexen Fälle  
  async detectWithGPT4(message: string, context: ChatContext) {
    // Nur wenn Pattern-Detection unsicher ist
    // Oder bei Context-Switches
    // Oder bei sehr kurzen/mehrdeutigen Nachrichten
  }
  
  // Level 3: Adaptive Learning (Optional)
  async improvePatterns(successfulDetections: Array<{message: string, correctTopic: string}>) {
    // Sammle erfolgreiche GPT-4 Detections
    // Extrahiere neue Patterns automatisch
    // Update Pattern-Database
  }
}

// PERFORMANCE ZIEL:
// 80% Requests: ~1ms (Pattern)
// 20% Requests: ~800ms (GPT-4)  
// → Durchschnitt: ~160ms (3x besser als Pure GPT-4)

// KOSTEN ZIEL:
// 80% Requests: CHF 0.00
// 20% Requests: CHF 0.002
// → Bei 1000 Requests/Tag: CHF 0.40 (5x günstiger)
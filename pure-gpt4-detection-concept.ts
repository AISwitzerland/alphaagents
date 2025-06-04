// Konzept: Pure GPT-4 Topic Detection
// Vorteile und Nachteile

interface GPT4TopicDetection {
  async detectTopicWithPureGPT4(message: string, sessionContext: ChatContext): Promise<{
    topic: string;
    intent: string;
    urgency: 'low' | 'medium' | 'high';
    confidence: number;
    reasoning: string;
  }> {
    
    const systemPrompt = `Du bist ein Experte für Conversation Topic Detection in einem Schweizer Versicherungsunternehmen.

Analysiere die Kundennachricht und bestimme:
1. Topic: quote|appointment|document_upload|faq|general
2. Intent: Spezifischer Intent innerhalb des Topics
3. Urgency: low|medium|high
4. Confidence: 0.0-1.0
5. Reasoning: Kurze Begründung

Kontext:
- Vorherige Topics: ${sessionContext.topicHistory.join(', ')}
- Aktuelle Unterhaltung: ${sessionContext.conversationHistory.slice(-3).map(m => m.content).join(' -> ')}

Antworte nur im JSON Format:
{
  "topic": "quote",
  "intent": "reiseversicherung_offerte", 
  "urgency": "medium",
  "confidence": 0.85,
  "reasoning": "Kunde möchte explizit Reiseversicherung"
}`;

    const prompt = `Kundennachricht: "${message}"
    
Analysiere und antworte im JSON Format:`;

    try {
      const result = await this.openai.generateText(prompt, {
        systemPrompt,
        temperature: 0.1, // Sehr konsistent
        maxTokens: 150
      });
      
      // Parse JSON response
      const analysis = JSON.parse(result.content);
      
      return analysis;
    } catch (error) {
      // Fallback zu Pattern-Detection
      return this.detectTopicByPatterns(message);
    }
  }
}

// ===== PERFORMANCE VERGLEICH =====

// HYBRID ANSATZ (Aktuell):
// ✅ Pattern: ~1ms (95% der Fälle)
// ⚡ GPT-4: ~800ms (5% der Fälle) 
// → Durchschnitt: ~50ms pro Request

// PURE GPT-4 ANSATZ:
// 🤖 GPT-4: ~800ms (100% der Fälle)
// → Durchschnitt: ~800ms pro Request

// ===== KOSTEN VERGLEICH =====
// Pattern: CHF 0.00 pro Request
// GPT-4: ~CHF 0.002 pro Request
// → Bei 1000 Requests/Tag: CHF 2 vs. CHF 0.10

// ===== VORTEILE PURE GPT-4 =====
// ✅ Viel intelligenter bei edge cases
// ✅ Versteht Kontext besser  
// ✅ Kann komplexe Nuancen erkennen
// ✅ Weniger Code zu maintainen
// ✅ Automatische "Lernfähigkeit" durch Model Updates

// ===== NACHTEILE PURE GPT-4 =====
// ❌ 16x langsamer (800ms vs. 50ms)
// ❌ 20x teurer (CHF 0.002 vs. CHF 0.00)
// ❌ Abhängigkeit von OpenAI Verfügbarkeit
// ❌ Unvorhersagbare Latency
// ❌ Potentielle Halluzinationen bei JSON Parsing
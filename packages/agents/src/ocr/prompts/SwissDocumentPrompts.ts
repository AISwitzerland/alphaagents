/**
 * Optimierte Prompts für Schweizer Versicherungsdokumente
 * Basierend auf Test-Ergebnissen und Best Practices
 */

export interface DocumentExample {
  type: string;
  keywords: string[];
  example: string;
}

export const SWISS_DOCUMENT_EXAMPLES: DocumentExample[] = [
  {
    type: "Unfallbericht",
    keywords: ["UVG", "Unfall", "Verletzung", "Suva", "SUVA", "Arbeitsunfall", "Unfallversicherung"],
    example: `SUVA-Formulare oder UVG-Dokumente mit Feldern wie:
    - Arbeitgeber, Verletzte/r Person
    - Unfalldatum, Unfallzeit, Unfallort
    - Art der Verletzung, betroffener Körperteil
    - AHV-Nummer, Schadensnummer
    WICHTIG: Auch "Schadenmeldung UVG" ist ein Unfallbericht!`
  },
  {
    type: "Kündigungsschreiben", 
    keywords: ["Kündigung", "kündigen", "Vertragsbeendigung", "Police beenden"],
    example: `Kündigungsschreiben mit Inhalten wie:
    - "Hiermit kündige ich", "Police Nr.", "zum nächstmöglichen Termin"
    - Versicherungsnummer, Kündigungsgrund
    - Unterschrift, Datum der Kündigung`
  },
  {
    type: "Schadenmeldung",
    keywords: ["Schaden", "Schadensmeldung", "Sachschaden", "Diebstahl"],
    example: `Schadensmeldung für Sachschäden wie:
    - Art des Schadens (Feuer, Wasser, Diebstahl)
    - Schadensdatum, Schadensort
    - Beschreibung des Schadens, Schadenshöhe`
  },
  {
    type: "Rechnung",
    keywords: ["Rechnung", "Faktura", "CHF", "Betrag", "Fälligkeit"],
    example: `Rechnung/Faktura mit:
    - Rechnungsnummer, Rechnungsdatum
    - Betrag in CHF, Fälligkeitsdatum
    - Rechnungsempfänger, Leistungsbeschreibung`
  }
];

export class SwissDocumentPrompts {
  
  /**
   * Optimierter Klassifizierungsprompt mit Chain-of-Thought
   */
  static getClassificationPrompt(): string {
    const examples = SWISS_DOCUMENT_EXAMPLES.map(ex => 
      `**${ex.type}**: ${ex.keywords.join(', ')} → ${ex.example}`
    ).join('\n\n');

    return `Du bist ein Experte für Schweizer Versicherungsdokumente. 

ANALYSIERE das Dokument Schritt für Schritt:

1. **Erkenne Schlüsselwörter**: Suche nach diesen spezifischen Begriffen
2. **Bestimme Kontext**: Ist es ein Formular, Brief, oder Rechnung?
3. **Prüfe Checkboxen**: Bei SUVA-Formularen erkenne angekreuzte Felder (☑️ vs ☐)
4. **Klassifiziere exakt**: Verwende NUR diese 4 Kategorien

SCHWEIZER DOKUMENTTYPEN:
${examples}

KLASSIFIZIERUNGS-REGELN (STRIKT BEFOLGEN):
- Bei "Kündigung", "kündigen", "beenden" → IMMER "Kündigungsschreiben"
- Bei "Rechnung", "CHF", "Betrag" → "Rechnung"
- Bei "Schaden" OHNE Unfall → "Schadenmeldung"
- Alles andere → "Sonstiges Dokument"

🚨 ABSOLUTE REGEL FÜR SUVA/UVG DOKUMENTE:
WENN das Dokument IRGENDEINS dieser Wörter enthält:
- "SUVA" oder "Suva" 
- "UVG" 
- "Schadenmeldung UVG"
- "Unfallversicherung"
- "Arbeitsunfall" oder "Betriebsunfall"
→ DANN klassifiziere es IMMER als "Unfallbericht" (NIEMALS als "Formular"!)

WICHTIG: 
- SUVA = Schweizerische Unfallversicherungsanstalt → IMMER Unfallbericht
- UVG = Unfallversicherungsgesetz → IMMER Unfallbericht  
- "Schadenmeldung UVG" = Unfallbericht (NICHT Schadenmeldung!)
- Alle SUVA-Formulare gehen in die accident_reports Tabelle

CHECKBOX-ERKENNUNG für SUVA-Formulare:
- Suche nach den 4 Checkboxen oben: "Unfall", "Zahnschaden", "Berufskrankheit", "Rückfall"
- Erkenne angekreuzte (☑️) vs. leere (☐) Checkboxen
- Notiere welche Checkboxen angekreuzt sind im keyFields-Bereich

CHAIN-OF-THOUGHT BEISPIELE:
1. Ich sehe "SUVA-Formular" → SUVA = Schweizerische Unfallversicherungsanstalt
2. Felder wie "Verletzte/r", "Unfallort" → Bestätigt Unfall
3. KLASSIFIKATION: "Unfallbericht" (Confidence: 0.95)

ODER:
1. Ich sehe "Schadenmeldung UVG" → UVG = Unfallversicherungsgesetz  
2. Trotz "Schaden" ist es UVG → Das bedeutet Arbeitsunfall
3. KLASSIFIKATION: "Unfallbericht" (NICHT Schadenmeldung!)

🔥 FINALE VALIDIERUNG VOR ANTWORT:
1. Prüfe den extrahierten Text nochmal auf: "SUVA", "UVG", "Schadenmeldung UVG", "Unfallversicherung"
2. Falls EINER dieser Begriffe gefunden wird → Ändere "type" zu "Unfallbericht"
3. Falls "Kündigung" gefunden wird → Ändere "type" zu "Kündigungsschreiben"

Antworte mit diesem EXAKTEN JSON Format:
{
  "reasoning": "1. Schlüsselwörter: [gefundene Begriffe] 2. SUVA-Check: [ja/nein] 3. Finale Entscheidung: [Begründung]",
  "type": "Unfallbericht|Schadenmeldung|Kündigungsschreiben|Rechnung|Sonstiges Dokument",
  "category": "Versicherung|Verwaltung|Finanzen|Sonstiges", 
  "confidence": 0.85,
  "summary": "Kurze Beschreibung des Dokuments",
  "keyFields": {
    "document_date": "YYYY-MM-DD oder null",
    "document_number": "Dokumentnummer oder null",
    "person_name": "Name der Person oder null",
    "amount": "Betrag ohne CHF oder null",
    "suva_checkboxes": {
      "unfall": "true/false - ob Checkbox angekreuzt",
      "zahnschaden": "true/false - ob Checkbox angekreuzt", 
      "berufskrankheit": "true/false - ob Checkbox angekreuzt",
      "rueckfall": "true/false - ob Checkbox angekreuzt"
    },
    "key_info": "Wichtigste Information"
  },
  "language": "de"
}`;
  }

  /**
   * Optimierter Text-Extraktionsprompt
   */
  static getTextExtractionPrompt(): string {
    return `SCHWEIZER DOKUMENT - VOLLSTÄNDIGE TEXTEXTRAKTION

Extrahiere JEDEN sichtbaren Text aus diesem Schweizer Dokument:

WICHTIGE SCHWEIZER ELEMENTE:
- AHV-Nummern (Format: 756.XXXX.XXXX.XX)
- Postleitzahlen (4-stellig: 8001, 9000, etc.)
- Telefonnummern (+41, 079, 044, etc.)
- CHF Beträge (CHF 100.50, 1'000.-)
- Schweizer Ortschaften
- Versicherungsnummern
- Alle Datumsangaben (DD.MM.YYYY, DD.MM.YY)

EXTRAKTION:
- Lies ALLES: Gedruckten Text, Handschrift, Zahlen
- Behalte Struktur bei: Zeilen, Absätze, Tabellen
- Spezielle Zeichen: ä, ö, ü, ß korrekt erfassen
- Bei unleserlichen Stellen: [unleserlich] verwenden

Gib NUR den extrahierten Text zurück, keine Erklärungen.`;
  }

  /**
   * Strukturierte Datenextraktion für spezifische Dokumenttypen
   */
  static getStructuredExtractionPrompt(documentType: string): string {
    const typeSpecificFields = this.getTypeSpecificFields(documentType);
    
    return `SCHWEIZER ${documentType.toUpperCase()} - STRUKTURIERTE DATENEXTRAKTION

Aus diesem ${documentType} extrahiere EXAKT folgende Daten:

${typeSpecificFields}

SCHWEIZER DATENFORMATE:
- Datum: DD.MM.YYYY → YYYY-MM-DD konvertieren
- AHV: 756.XXXX.XXXX.XX → exakt so übernehmen
- Telefon: +41 XX XXX XX XX oder 0XX XXX XX XX
- PLZ: 4-stellig (1000-9999)
- Betrag: "CHF 1'234.50" → 1234.50 (nur Zahl)

EXTRAKTION-REGELN:
- Fehlende Pflichtfelder: "Nicht angegeben"
- Fehlende optionale Felder: null
- Unsichere Werte: Mit "?" markieren
- Mehrere gefundene Werte: Ersten nehmen

Antworte NUR mit gültigem JSON ohne zusätzlichen Text:`;
  }

  /**
   * Dokumenttyp-spezifische Felder
   */
  private static getTypeSpecificFields(documentType: string): string {
    const fields: Record<string, string> = {
      "Unfallbericht": `
PFLICHTFELDER:
- "person_name": "Vollständiger Name der verletzten Person"
- "birth_date": "Geburtsdatum im Format YYYY-MM-DD"
- "ahv_number": "AHV-Nummer im Format 756.XXXX.XXXX.XX"
- "accident_date": "Unfalldatum YYYY-MM-DD"
- "accident_time": "Unfallzeit HH:MM oder null"
- "accident_location": "Genauer Unfallort"
- "injury_description": "Art der Verletzung"
- "body_part": "Betroffener Körperteil"

SUVA CHECKBOXEN (sehr wichtig):
- "checkbox_unfall": "true/false - Checkbox 'Unfall' angekreuzt"
- "checkbox_zahnschaden": "true/false - Checkbox 'Zahnschaden' angekreuzt"
- "checkbox_berufskrankheit": "true/false - Checkbox 'Berufskrankheit' angekreuzt"
- "checkbox_rueckfall": "true/false - Checkbox 'Rückfall' angekreuzt"

OPTIONAL:
- "employer": "Name des Arbeitgebers"
- "claim_number": "Schadensnummer"
- "phone": "Telefonnummer"`,

      "Schadenmeldung": `
PFLICHTFELDER:
- "person_name": "Name der versicherten Person"
- "address": "Vollständige Adresse"
- "damage_date": "Schadensdatum YYYY-MM-DD"
- "damage_location": "Ort des Schadens"
- "damage_description": "Beschreibung des Schadens"

OPTIONAL:
- "policy_number": "Versicherungsnummer"
- "damage_amount": "Schadenshöhe als Zahl"
- "phone": "Telefonnummer"`,

      "Kündigungsschreiben": `
PFLICHTFELDER:
- "person_name": "Name des Kunden"
- "address": "Adresse des Kunden"
- "policy_number": "Police/Vertragsnummer"
- "termination_date": "Kündigungsdatum YYYY-MM-DD"
- "termination_reason": "Grund der Kündigung"

OPTIONAL:
- "insurance_company": "Name der Versicherung"
- "notice_period": "Kündigungsfrist"`,

      "Rechnung": `
PFLICHTFELDER:
- "invoice_number": "Rechnungsnummer"
- "invoice_date": "Rechnungsdatum YYYY-MM-DD"
- "due_date": "Fälligkeitsdatum YYYY-MM-DD"
- "amount": "Rechnungsbetrag als Zahl"
- "currency": "Währung (CHF, EUR, etc.)"
- "recipient": "Rechnungsempfänger"

OPTIONAL:
- "vat_amount": "MwSt-Betrag als Zahl"
- "payment_reference": "Zahlungsreferenz"`
    };

    return fields[documentType] || `
STANDARD FELDER:
- "document_title": "Titel des Dokuments"
- "document_date": "Dokumentdatum YYYY-MM-DD"
- "summary": "Kurze Zusammenfassung"`;
  }

  /**
   * Confidence Scoring Prompt
   */
  static getConfidencePrompt(): string {
    return `BEWERTE die Klassifizierungs-Sicherheit:

CONFIDENCE FAKTOREN:
- 0.9-1.0: Eindeutige Schlüsselwörter + vollständige Struktur
- 0.7-0.9: Klare Indikatoren + typische Felder
- 0.5-0.7: Einige Hinweise + partielle Struktur  
- 0.3-0.5: Wenige Indikatoren + unsichere Zuordnung
- 0.0-0.3: Keine klaren Hinweise

BEISPIEL BEWERTUNG:
- "Schadenmeldung UVG" + Unfallfelder → 0.95
- "Kündigung" + Policenummer → 0.90
- Nur "Schaden" ohne Kontext → 0.60`;
  }
}

export default SwissDocumentPrompts;
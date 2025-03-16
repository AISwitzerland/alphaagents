import { Document } from '../../types/document';
import { BaseAgent, AgentOptions, AgentResult } from '../../interfaces/BaseAgent';
import { ProcessingStage } from '../../types/coordination';

/**
 * OCRAgent - verantwortlich für die Texterkennung aus Dokumenten
 * Dies ist eine vereinfachte Simulation ohne direkte Anbindung an den OCRService
 */
export class OCRAgentSimplified implements BaseAgent {
  private static instance: OCRAgentSimplified | null = null;
  readonly type = 'ocr';
  
  private constructor() {
    // Initialisierung
  }
  
  /**
   * Gibt die Singleton-Instanz des OCRAgent zurück
   */
  public static getInstance(): OCRAgentSimplified {
    if (!OCRAgentSimplified.instance) {
      OCRAgentSimplified.instance = new OCRAgentSimplified();
    }
    return OCRAgentSimplified.instance;
  }
  
  /**
   * Implementierung des BaseAgent-Interface
   * Simuliert OCR-Verarbeitung ohne tatsächliche OCR-Durchführung
   */
  public async process(document: Document, options?: AgentOptions): Promise<AgentResult> {
    console.log(`Processing document ${document.id} with OCRAgentSimplified`);
    
    try {
      // Simuliere Verarbeitungszeit
      await this.simulateProcessingDelay(options?.timeout || 2000);
      
      // Prüfe, ob das Dokument bereits OCR-verarbeitet wurde
      if (document.text && document.text.length > 0) {
        console.log('Document already has text content, reusing existing text');
        return {
          success: true,
          data: document,
          confidence: 0.95,
          metadata: {
            source: 'existing_text',
            processingTime: 0
          }
        };
      }
      
      // Simuliere OCR-Ergebnis basierend auf Dokumententyp
      let extractedText: string;
      let confidence: number;
      
      if (document.documentType) {
        const documentType = document.documentType.toLowerCase();
        if (documentType.includes('invoice') || documentType.includes('rechnung')) {
          extractedText = this.generateSampleInvoiceText();
          confidence = 0.87;
        } else if (documentType.includes('contract') || documentType.includes('vertrag')) {
          extractedText = this.generateSampleContractText();
          confidence = 0.92;
        } else if (documentType.includes('id') || documentType.includes('ausweis')) {
          extractedText = this.generateSampleIdText();
          confidence = 0.85;
        } else {
          extractedText = this.generateGenericText();
          confidence = 0.75;
        }
      } else {
        // Generischer Text für unklassifizierte Dokumente
        extractedText = this.generateGenericText();
        confidence = 0.70;
      }
      
      // Bereite das Ergebnis vor
      return {
        success: true,
        data: {
          ...document,
          text: extractedText,
          classificationConfidence: confidence,
          metadata: {
            ...document.metadata,
            ocrLanguage: 'deu',
            ocrProcessedAt: new Date().toISOString(),
            ocrConfidence: confidence
          }
        },
        confidence: confidence,
        metadata: {
          processingTime: options?.timeout || 2000,
          language: 'deu'
        }
      };
    } catch (error) {
      console.error('Error in OCRAgentSimplified.process:', error);
      return {
        success: false,
        error: {
          code: 'OCR_PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown OCR processing error',
          details: error,
          retryable: true
        }
      };
    }
  }
  
  /**
   * Prüft, ob der Agent eine bestimmte Verarbeitungsstufe unterstützt
   */
  public canHandle(stage: ProcessingStage, document: Document): boolean {
    // OCRAgent kann nur die OCR-Verarbeitungsstufe bearbeiten
    return stage === 'ocr_processed';
  }
  
  /**
   * Gibt den aktuellen Status des Agenten zurück
   */
  public getStatus(): { available: boolean; busy: boolean; queue: number } {
    // In dieser einfachen Implementation ist der Agent immer verfügbar
    return {
      available: true,
      busy: false,
      queue: 0
    };
  }
  
  /**
   * Ressourcen bereinigen
   */
  public async shutdown(): Promise<void> {
    // Keine speziellen Ressourcen zu bereinigen
    console.log('OCRAgentSimplified shutting down');
    return Promise.resolve();
  }
  
  /**
   * Simuliert eine Verarbeitungsverzögerung
   */
  private simulateProcessingDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Generiert Beispieltext für Rechnungen
   */
  private generateSampleInvoiceText(): string {
    return `Rechnung Nr. 2023-4587
Datum: 15.06.2023

Kunde: Mustermann GmbH
Kundennummer: KD-12345
Anschrift: Musterstraße 123, 10115 Berlin

Position 1: Dienstleistung A      250,00 EUR
Position 2: Produkt B (3x)        179,85 EUR
Position 3: Wartung               120,00 EUR

Nettobetrag:                      549,85 EUR
Mehrwertsteuer (19%):             104,47 EUR
Gesamtbetrag:                     654,32 EUR

Zahlbar bis: 15.07.2023
IBAN: DE12 3456 7890 1234 5678 90
BIC: DEUTDEDBBER

Vielen Dank für Ihr Vertrauen!`;
  }
  
  /**
   * Generiert Beispieltext für Verträge
   */
  private generateSampleContractText(): string {
    return `DIENSTLEISTUNGSVERTRAG

zwischen

Musterfirma AG
Musterplatz 1
10115 Berlin
vertreten durch den Vorstand Max Mustermann
- nachfolgend "Auftragnehmer" genannt -

und

Beispiel GmbH
Beispielstraße 42
80331 München
vertreten durch die Geschäftsführerin Erika Beispiel
- nachfolgend "Auftraggeber" genannt -

§ 1 Vertragsgegenstand
Der Auftragnehmer verpflichtet sich, für den Auftraggeber folgende Dienstleistungen zu erbringen:
- Entwicklung einer Software zur Dokumentenverarbeitung
- Integration in bestehende Systeme
- Schulung der Mitarbeiter

§ 2 Vergütung
Für die unter § 1 genannten Leistungen erhält der Auftragnehmer eine Vergütung in Höhe von 50.000,00 EUR zzgl. gesetzlicher Mehrwertsteuer.`;
  }
  
  /**
   * Generiert Beispieltext für Ausweisdokumente
   */
  private generateSampleIdText(): string {
    return `PERSONALAUSWEIS
BUNDESREPUBLIK DEUTSCHLAND

Name: MUSTERMANN
Vorname: MAX
Geburtsdatum: 01.01.1990
Geburtsort: BERLIN
Staatsangehörigkeit: DEUTSCH
Ausstellungsdatum: 01.06.2020
Gültig bis: 01.06.2030
Ausweisnummer: L01X00T47
Unterschrift: [Unterschrift]`;
  }
  
  /**
   * Generiert generischen Text für unklassifizierte Dokumente
   */
  private generateGenericText(): string {
    return `Dokument vom 20.05.2023

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Kontakt:
info@example.com
Tel: +49 30 123456
www.example.com`;
  }
}

export default OCRAgentSimplified; 
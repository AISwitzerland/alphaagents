import { OCR_CONFIG } from './config/ocrConfig';
import { ProcessingError, OCRResult, OCRLanguage, OCROptions } from '../../types/ocr';
import { ImagePreprocessor } from './utils/imagePreprocessor';
import * as fs from 'fs';

/**
 * Service für die OCR-Verarbeitung
 * Vereinfachte Version für die Produktionsumgebung
 */
export class OCRService {
  private static instance: OCRService;
  private imagePreprocessor: ImagePreprocessor;

  private constructor() {
    this.imagePreprocessor = new ImagePreprocessor();
  }

  /**
   * Gibt die Singleton-Instanz des OCR-Service zurück
   */
  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  /**
   * Verarbeitet ein Bild mit OCR
   * In einer vollständigen Implementation würde hier Tesseract.js oder
   * eine andere OCR-Engine angebunden werden
   */
  public async processImage(
    imagePath: string,
    language: OCRLanguage = OCR_CONFIG.ocr.defaultLanguage,
    options: OCROptions = {}
  ): Promise<OCRResult> {
    try {
      console.log(`OCR processing started for ${imagePath} with language ${language}`);
      
      // Bildvorverarbeitung
      const preprocessResult = await this.imagePreprocessor.preprocessImage(imagePath);
      
      // Simuliere eine Verarbeitungszeit
      await this.simulateProcessingDelay(1000);
      
      // Simuliere Texterkennung basierend auf Dateiname und Sprache
      const extractedText = this.simulateTextExtraction(
        preprocessResult.processedImagePath, 
        language
      );
      
      // Simuliere Konfidenz
      const confidence = 0.85 + Math.random() * 0.1;
      
      // Bereinige temporäre Dateien
      if (preprocessResult.temporaryFiles?.length) {
        for (const tempFile of preprocessResult.temporaryFiles) {
          try {
            if (fs.existsSync(tempFile)) {
              fs.unlinkSync(tempFile);
            }
          } catch (error) {
            console.warn(`Fehler beim Bereinigen der temporären Datei ${tempFile}:`, error);
          }
        }
      }

      return {
        text: extractedText,
        confidence,
        language,
        processedAt: new Date(),
        metadata: {
          ...preprocessResult.metadata,
          options
        }
      };
    } catch (error) {
      if (error instanceof ProcessingError) {
        throw error;
      }
      throw new ProcessingError(
        'OCR-Verarbeitung fehlgeschlagen',
        'OCR_PROCESSING_FAILED',
        { originalError: error }
      );
    }
  }

  /**
   * Validiert eine Sprache
   */
  public validateLanguage(language: string): boolean {
    return OCR_CONFIG.ocr.languages.includes(language as OCRLanguage);
  }

  /**
   * Gibt alle unterstützten Sprachen zurück
   */
  public getSupportedLanguages(): OCRLanguage[] {
    return [...OCR_CONFIG.ocr.languages];
  }

  /**
   * Gibt alle unterstützten Ausgabeformate zurück
   */
  public getSupportedOutputFormats(): string[] {
    return [...OCR_CONFIG.output.supportedFormats];
  }
  
  /**
   * Simuliert eine Verzögerung für die Verarbeitung
   */
  private simulateProcessingDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Simuliert die Texterkennung basierend auf dem Dateinamen
   */
  private simulateTextExtraction(imagePath: string, language: OCRLanguage): string {
    const fileLower = imagePath.toLowerCase();
    
    if (fileLower.includes('rechnung') || fileLower.includes('invoice')) {
      return this.getInvoiceText(language);
    } else if (fileLower.includes('vertrag') || fileLower.includes('contract')) {
      return this.getContractText(language);
    } else if (fileLower.includes('ausweis') || fileLower.includes('id')) {
      return this.getIdText(language);
    } else {
      return this.getGenericText(language);
    }
  }
  
  /**
   * Beispieltext für Rechnungen
   */
  private getInvoiceText(language: OCRLanguage): string {
    if (language === 'deu') {
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
BIC: DEUTDEDBBER`;
    } else if (language === 'eng') {
      return `Invoice No. 2023-4587
Date: 15/06/2023

Customer: Mustermann GmbH
Customer No.: KD-12345
Address: Musterstrasse 123, 10115 Berlin

Item 1: Service A             250.00 EUR
Item 2: Product B (3x)        179.85 EUR
Item 3: Maintenance           120.00 EUR

Net amount:                   549.85 EUR
VAT (19%):                    104.47 EUR
Total amount:                 654.32 EUR

Due date: 15/07/2023
IBAN: DE12 3456 7890 1234 5678 90
BIC: DEUTDEDBBER`;
    } else {
      return `Facture No. 2023-4587
Date: 15/06/2023

Client: Mustermann GmbH
No. Client: KD-12345
Adresse: Musterstrasse 123, 10115 Berlin

Article 1: Service A            250,00 EUR
Article 2: Produit B (3x)       179,85 EUR
Article 3: Maintenance          120,00 EUR

Montant net:                    549,85 EUR
TVA (19%):                      104,47 EUR
Montant total:                  654,32 EUR

Échéance: 15/07/2023
IBAN: DE12 3456 7890 1234 5678 90
BIC: DEUTDEDBBER`;
    }
  }
  
  /**
   * Beispieltext für Verträge
   */
  private getContractText(language: OCRLanguage): string {
    if (language === 'deu') {
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
- Schulung der Mitarbeiter`;
    } else {
      return `SERVICE CONTRACT

between

Musterfirma AG
Musterplatz 1
10115 Berlin
represented by the board member Max Mustermann
- hereinafter referred to as "Contractor" -

and

Beispiel GmbH
Beispielstrasse 42
80331 Munich
represented by the managing director Erika Beispiel
- hereinafter referred to as "Client" -

§ 1 Subject of the Contract
The Contractor undertakes to provide the following services for the Client:
- Development of document processing software
- Integration into existing systems
- Employee training`;
    }
  }
  
  /**
   * Beispieltext für Ausweisdokumente
   */
  private getIdText(language: OCRLanguage): string {
    if (language === 'deu') {
      return `PERSONALAUSWEIS
BUNDESREPUBLIK DEUTSCHLAND

Name: MUSTERMANN
Vorname: MAX
Geburtsdatum: 01.01.1990
Geburtsort: BERLIN
Staatsangehörigkeit: DEUTSCH
Ausstellungsdatum: 01.06.2020
Gültig bis: 01.06.2030
Ausweisnummer: L01X00T47`;
    } else {
      return `IDENTITY CARD
FEDERAL REPUBLIC OF GERMANY

Surname: MUSTERMANN
Given names: MAX
Date of birth: 01.01.1990
Place of birth: BERLIN
Nationality: GERMAN
Date of issue: 01.06.2020
Date of expiry: 01.06.2030
Identity card number: L01X00T47`;
    }
  }
  
  /**
   * Generischer Beispieltext
   */
  private getGenericText(language: OCRLanguage): string {
    if (language === 'deu') {
      return `Dokument vom 20.05.2023

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Kontakt:
info@example.com
Tel: +49 30 123456
www.example.com`;
    } else {
      return `Document dated 20.05.2023

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Contact:
info@example.com
Tel: +49 30 123456
www.example.com`;
    }
  }
} 
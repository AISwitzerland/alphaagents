/**
 * Beispiel für die Verwendung der verbesserten Dokumentklassifizierung
 * 
 * Dieses Skript demonstriert, wie die verbesserte Dokumentklassifizierung
 * für verschiedene Dokumenttypen funktioniert.
 */

import { enhancedFilenameClassification, improvedDocumentTypeDecision } from './enhancedDocumentClassification';

// Beispieldokumente
const documents = [
  { id: '1', filename: 'Kündigung Versicherung.pdf', aiType: 'unfall', aiConfidence: 0.85 },
  { id: '2', filename: 'Unfallbericht 12.05.2023.pdf', aiType: 'accident', aiConfidence: 0.92 },
  { id: '3', filename: 'Rechnung_123456.pdf', aiType: 'invoice', aiConfidence: 0.88 },
  { id: '4', filename: 'Vertragsdokument.pdf', aiType: 'contract', aiConfidence: 0.75 },
  { id: '5', filename: 'Dokument123.pdf', aiType: 'misc', aiConfidence: 0.60 }
];

// Funktion zur Demonstration der Dokumentklassifizierung
function demonstrateDocumentClassification() {
  console.log('=== Demonstration der verbesserten Dokumentklassifizierung ===\n');
  
  for (const doc of documents) {
    console.log(`\nDokument: ${doc.filename} (ID: ${doc.id})`);
    console.log('----------------------------------------');
    
    // 1. Dateinamenbasierte Klassifizierung
    const filenameResult = enhancedFilenameClassification(doc.filename);
    console.log(`Dateinamenbasierte Klassifizierung: ${filenameResult.type} (Konfidenz: ${filenameResult.confidence.toFixed(2)})`);
    
    // 2. KI-basierte Klassifizierung (simuliert)
    const aiResult = { type: doc.aiType, confidence: doc.aiConfidence };
    console.log(`KI-basierte Klassifizierung: ${aiResult.type} (Konfidenz: ${aiResult.confidence.toFixed(2)})`);
    
    // 3. Verbesserte Entscheidungslogik
    const decision = improvedDocumentTypeDecision(filenameResult, aiResult);
    console.log(`\nFinale Entscheidung: ${decision.type} (Quelle: ${decision.source}, Konfidenz: ${decision.confidence.toFixed(2)})`);
    
    // 4. Erklärung der Entscheidung
    console.log('\nErklärung:');
    if (decision.source === 'both') {
      console.log('- Beide Klassifizierungsmethoden stimmen überein');
    } else if (decision.source === 'filename') {
      console.log('- Die dateinamenbasierte Klassifizierung wurde bevorzugt');
      console.log(`- Grund: Hohe Konfidenz (${filenameResult.confidence.toFixed(2)}) im Dateinamen`);
    } else if (decision.source === 'ai') {
      console.log('- Die KI-basierte Klassifizierung wurde bevorzugt');
      console.log(`- Grund: Sehr hohe Konfidenz (${aiResult.confidence.toFixed(2)}) der KI`);
    } else {
      console.log('- Keine der Methoden hatte ausreichende Konfidenz');
      console.log('- Standard-Typ "misc" wurde verwendet');
    }
    
    // 5. Speicherort in der Datenbank
    console.log('\nSpeicherort in der Datenbank:');
    switch (decision.type) {
      case 'contract_change':
        console.log('- documents-Tabelle');
        console.log('- contract_changes-Tabelle');
        break;
      case 'accident':
        console.log('- documents-Tabelle');
        console.log('- accident_reports-Tabelle');
        break;
      case 'invoice':
        console.log('- documents-Tabelle');
        console.log('- invoices-Tabelle');
        break;
      case 'contract':
        console.log('- documents-Tabelle');
        console.log('- contracts-Tabelle');
        break;
      default:
        console.log('- Nur documents-Tabelle');
    }
  }
}

// Führe die Demonstration aus
demonstrateDocumentClassification();

/**
 * Beispielausgabe für "Kündigung Versicherung.pdf":
 * 
 * Dokument: Kündigung Versicherung.pdf (ID: 1)
 * ----------------------------------------
 * Dateinamenbasierte Klassifizierung: contract_change (Konfidenz: 0.90)
 * KI-basierte Klassifizierung: unfall (Konfidenz: 0.85)
 * 
 * Finale Entscheidung: contract_change (Quelle: filename, Konfidenz: 0.90)
 * 
 * Erklärung:
 * - Die dateinamenbasierte Klassifizierung wurde bevorzugt
 * - Grund: Hohe Konfidenz (0.90) im Dateinamen
 * 
 * Speicherort in der Datenbank:
 * - documents-Tabelle
 * - contract_changes-Tabelle
 */ 
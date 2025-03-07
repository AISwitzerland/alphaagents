# Verbesserte Dokumentklassifizierung

Diese Dokumentation beschreibt die verbesserte Dokumentklassifizierung, die entwickelt wurde, um die Genauigkeit der Dokumenttyperkennung zu erhöhen, insbesondere für Kündigungsschreiben und andere Vertragsänderungen.

## Hintergrund

Das bestehende System hatte Schwierigkeiten, bestimmte Dokumenttypen korrekt zu klassifizieren, insbesondere:
- "Kündigung Versicherung.pdf" wurde fälschlicherweise als "unfall" klassifiziert
- Dokumente wurden nur in der "documents"-Tabelle gespeichert, nicht in den spezifischen Tabellen wie "contract_changes"

## Neue Komponenten

Die verbesserte Dokumentklassifizierung besteht aus drei Hauptdateien:

1. **enhancedDocumentClassification.ts**
   - Enthält die Kernfunktionalität der verbesserten Klassifizierung
   - Implementiert eine umfangreiche Schlüsselworterkennung für Dateinamen
   - Bietet eine verbesserte Entscheidungslogik zwischen dateinamenbasierter und KI-basierter Klassifizierung
   - Enthält eine Protokollierungsfunktion für spätere Analyse

2. **documentClassificationIntegration.ts**
   - Dient als Brücke zwischen der bestehenden Codebase und der verbesserten Klassifizierung
   - Bietet einfache Integrationsfunktionen, die in die bestehende Codebase eingebunden werden können

3. **enhancedDocumentClassification.test.ts**
   - Enthält Tests für die verbesserte Klassifizierung
   - Überprüft die korrekte Erkennung verschiedener Dokumenttypen
   - Testet die Entscheidungslogik in verschiedenen Szenarien

## Hauptfunktionen

### 1. Verbesserte dateinamenbasierte Klassifizierung

Die Funktion `enhancedFilenameClassification` erkennt den Dokumenttyp basierend auf Schlüsselwörtern im Dateinamen:

```typescript
function enhancedFilenameClassification(filename: string): { type: string, confidence: number }
```

- Normalisiert den Dateinamen (Kleinbuchstaben, ohne Dateiendung)
- Prüft auf spezifische Schlüsselwörter für verschiedene Dokumenttypen
- Gibt den erkannten Typ und einen Konfidenzwert zurück

### 2. Verbesserte Entscheidungslogik

Die Funktion `improvedDocumentTypeDecision` entscheidet zwischen dateinamenbasierter und KI-basierter Klassifizierung:

```typescript
function improvedDocumentTypeDecision(
  filenameResult: { type: string, confidence: number },
  aiResult: { type: string, confidence: number }
): { type: string, source: 'filename' | 'ai' | 'both' | 'default', confidence: number }
```

- Wenn beide Methoden zum gleichen Ergebnis kommen, wird dieses verwendet
- Bei hoher Konfidenz der dateinamenbasierten Klassifizierung wird diese bevorzugt
- Bei sehr hoher Konfidenz der KI-basierten Klassifizierung wird diese bevorzugt
- Bei niedriger Konfidenz beider Methoden wird "misc" zurückgegeben

### 3. Protokollierung der Klassifizierungsergebnisse

Die Funktion `logClassificationResult` protokolliert die Klassifizierungsergebnisse für spätere Analyse:

```typescript
async function logClassificationResult(
  documentId: string,
  filenameResult: { type: string, confidence: number },
  aiResult: { type: string, confidence: number },
  finalDecision: { type: string, source: string, confidence: number }
)
```

## Integration in die bestehende Codebase

Um die verbesserte Dokumentklassifizierung in die bestehende Codebase zu integrieren, folgen Sie diesen Schritten:

### 1. In utils/file.ts:

Importieren Sie die Funktionen aus der Integrationsdatei:

```typescript
import { getDocumentTypeFromFilename, determineDocumentType, logDocumentClassification } from './documentClassificationIntegration';
```

### 2. Ersetzen Sie die bestehende dateinamenbasierte Klassifizierung:

Suchen Sie nach dem Code, der den Dokumenttyp aus dem Dateinamen bestimmt, und ersetzen Sie ihn durch:

```typescript
const filenameTypeResult = getDocumentTypeFromFilename(filename);
const filenameType = filenameTypeResult.type;
const filenameConfidence = filenameTypeResult.confidence;

console.log(`Dateinamenbasierte Dokumenttyperkennung: ${filenameType} (Konfidenz: ${filenameConfidence})`);
```

### 3. Ersetzen Sie die Entscheidungslogik:

Suchen Sie nach dem Code, der zwischen dateinamenbasierter und KI-basierter Klassifizierung entscheidet, und ersetzen Sie ihn durch:

```typescript
const documentType = determineDocumentType(filenameType, filenameConfidence, aiType, aiConfidence);
```

### 4. Fügen Sie die Protokollierung hinzu:

Nach der finalen Entscheidung über den Dokumenttyp:

```typescript
logDocumentClassification(documentId, filenameType, filenameConfidence, aiType, aiConfidence, documentType);
```

## Beispiel für die Verarbeitung von "Kündigung Versicherung.pdf"

Mit der verbesserten Klassifizierung wird "Kündigung Versicherung.pdf" wie folgt verarbeitet:

1. **Dateinamenbasierte Klassifizierung:**
   - Erkennt "kündigung" als Schlüsselwort
   - Klassifiziert als "contract_change" mit Konfidenz 0.9

2. **KI-basierte Klassifizierung:**
   - Angenommen, die KI klassifiziert als "unfall" mit Konfidenz 0.85

3. **Entscheidungslogik:**
   - Dateinamenbasierte Klassifizierung hat hohe Konfidenz (0.9)
   - KI-basierte Klassifizierung hat nicht ausreichend hohe Konfidenz, um zu überschreiben
   - Finale Entscheidung: "contract_change"

4. **Ergebnis:**
   - Dokument wird korrekt als Vertragsänderung klassifiziert
   - Wird in der "contract_changes"-Tabelle gespeichert

## Vorteile der verbesserten Klassifizierung

1. **Höhere Genauigkeit:**
   - Umfangreiche Schlüsselworterkennung für verschiedene Dokumenttypen
   - Berücksichtigung der Konfidenzwerte beider Methoden

2. **Bessere Entscheidungslogik:**
   - Intelligente Abwägung zwischen dateinamenbasierter und KI-basierter Klassifizierung
   - Bevorzugung der zuverlässigeren Methode je nach Kontext

3. **Protokollierung für kontinuierliche Verbesserung:**
   - Sammlung von Daten für spätere Analyse
   - Möglichkeit zur Identifizierung von Mustern und Verbesserungspotenzial

## Nächste Schritte

1. **Integration in die bestehende Codebase**
2. **Tests mit realen Dokumenten**
3. **Analyse der Protokolldaten**
4. **Kontinuierliche Verbesserung der Schlüsselwörter und Entscheidungslogik** 
# **AlphaAgents - Detaillierte Agent-Übersichten**

## **Chat-Agent - Detaillierte Übersicht**

**Agent Name:** Chat-Agent

**Agent Kontext:**
Der Chat-Agent wird auf der Unternehmenswebsite implementiert und bietet interaktive Kundenerfahrungen. Er ermöglicht die Terminvereinbarung über ein integriertes Kalender-System, das Hochladen und die Verarbeitung von Dokumenten, die Beantwortung häufig gestellter Fragen und die Unterstützung bei verschiedenen Kundenanliegen. Der Agent ist darauf ausgelegt, eine nahtlose Benutzererfahrung zu gewährleisten und Kunden durch verschiedene Prozesse zu führen.

**Konversation Kontext:**
Der Chat-Agent interagiert direkt mit Website-Besuchern über eine Chat-Schnittstelle. Er sammelt und validiert Benutzerdaten (Name, E-Mail, Telefonnummer) für verschiedene Aufgaben. Der Agent erkennt Benutzerabsichten und leitet entsprechende Workflows ein. Er kann zwischen verschiedenen Gesprächsflüssen wechseln und den Kontext während der gesamten Unterhaltung beibehalten.

**Knowledge Kontext:**
Der Chat-Agent verwendet OpenAI GPT-4 für die Generierung kontextueller Antworten. Er greift auf eine FAQ-Datenbank zu, um häufig gestellte Fragen zu beantworten. Der Agent verfügt über vordefinierte Workflows für Dokumenten-Upload, Terminbuchung und allgemeine Kundenbetreuung.

**Was er für Programme brauchen wird:**
- Next.js 14 Frontend-Framework für die Chat-Schnittstelle
- OpenAI GPT-4 API für Intent-Erkennung und Antwortgenerierung
- Supabase für Datenbankintegration und Authentifizierung
- React mit TypeScript für die Benutzeroberfläche
- Framer Motion für Chat-Animationen
- Zustand für State Management
- ChatFlowManager für Gesprächssteuerung

**Agenten-Aufgaben und detaillierte Vorgehensweise:**

1. **Dokumenten-Upload-Prozess:**
   - Input: "Ich möchte ein Dokument hochladen."
   - Chat-Agent-Aktion: Startet Datensammlung-Workflow
   - Schritt 1: Fragt nach Name des Benutzers
   - Schritt 2: Fragt nach E-Mail-Adresse (mit Validierung)
   - Schritt 3: Fragt nach Telefonnummer (optional)
   - Schritt 4: Zeigt Dokument-Upload-Interface an
   - Ergebnis: Übergibt Dokument und Benutzerdaten an Document-Agent

2. **Terminvereinbarung:**
   - Input: "Ich möchte einen Termin buchen."
   - Chat-Agent-Aktion: Zeigt Terminbuchungsformular an
   - Datensammlung: Name, E-Mail, Telefonnummer, Notizen
   - Kalenderintegration: Zeigt verfügbare Zeitslots an
   - Bestätigung: Bucht Termin in Supabase-Datenbank
   - E-Mail-Versand: Sendet Terminbestätigung

3. **FAQ-Support:**
   - Input: "Welche Dienstleistungen bieten Sie an?"
   - Chat-Agent-Aktion: Durchsucht FAQ-Datenbank
   - GPT-4-Integration: Generiert kontextuelle Antwort
   - Output: Liefert präzise Antwort basierend auf Knowledge Base

4. **Intent-Erkennung und Kontextwechsel:**
   - Kontinuierliche Analyse der Benutzereingaben
   - Automatische Erkennung von Gesprächswechseln
   - Zurücksetzen von Datensammlung-Zuständen bei Kontextwechsel
   - Beibehaltung der letzten Bot-Nachrichten für Kontinuität

---

## **Document-Agent - Detaillierte Übersicht**

**Agent Name:** Document-Agent (EnhancedDocumentAgent)

**Agent Kontext:**
Der Document-Agent ist für die Überprüfung, Verarbeitung und sichere Speicherung von Dokumenten verantwortlich, die über Chat-Agent oder E-Mail-Agent hochgeladen werden. Er validiert Dateiformate und -größen, generiert eindeutige Dateinamen zur Konfliktvermeidung und erstellt strukturierte Datenbankeinträge für jedes verarbeitete Dokument.

**Konversation Kontext:**
Der Document-Agent arbeitet ausschließlich im Hintergrund ohne direkte Kundeninteraktion. Er kommuniziert mit anderen Agenten über definierte Schnittstellen und meldet Verarbeitungsergebnisse zurück an die aufrufenden Agenten.

**Knowledge Kontext:**
Der Document-Agent verfügt über Wissen über unterstützte Dateiformate (PDF, JPG, PNG, TIFF, DOCX), Größenlimits und Validierungsregeln. Er verwendet Dependency Injection für Datenbankservices und folgt dem Singleton-Pattern für Ressourcenverwaltung.

**Was er für Programme brauchen wird:**
- TypeScript für typsichere Entwicklung
- Supabase Client für Datenbankoperationen und Dateispeicherung
- Dependency Injection Container für Service-Management
- IDatabaseService Interface für modulare Datenbankintegration
- UUID-Generierung für eindeutige Dateinamen
- Comprehensive Error Handling und Logging

**Agenten-Aufgaben und detaillierte Vorgehensweise:**

1. **Dokument-Validierung:**
   - Input: Dokument-Objekt mit Datei-Buffer und Metadaten
   - Validierung: Überprüfung von Dateityp, Größe und Integrität
   - Unterstützte Formate: PDF, JPG, PNG, TIFF, DOCX
   - Fehlerbehandlung: Rückgabe strukturierter Fehlermeldungen bei ungültigen Dateien

2. **Eindeutige Dateinamengenerierung:**
   - Bereinigung von Sonderzeichen (#, %, /, \, &, ?, +, <, >, :)
   - Zeitstempel-Generierung (YYYYMMDD-HHmmss Format)
   - Zufällige 4-stellige Nummer für zusätzliche Eindeutigkeit
   - Format: `${bereinigterName}_${zeitstempel}_${zufallsId}.${erweiterung}`

3. **Dateispeicherung in Supabase Storage:**
   - Upload-Pfad: `${benutzerName}/${eindeutigerDateiname}`
   - Konfiguration: Cache-Control (3600s), kein Upsert
   - Rückgabe: Vollständiger Speicherpfad für Datenbankeinträge

4. **Datenbank-Eintrag-Erstellung:**
   - Strukturierte Datenerfassung: file_name, file_path, file_type, document_type
   - Metadaten-Speicherung: Ursprünglicher Name, eindeutiger Name, Benutzerinformationen
   - Status-Tracking: Initial auf 'in_bearbeitung' gesetzt
   - UUID-Generierung: Fallback für Benutzer-ID falls nicht vorhanden

5. **Fehlerbehandlung und Logging:**
   - Detaillierte Protokollierung aller Verarbeitungsschritte
   - Strukturierte Fehlerrückgabe mit Fehlercodes und Retry-Informationen
   - Cleanup bei fehlgeschlagener Verarbeitung

---

## **OCR-Agent - Detaillierte Übersicht**

**Agent Name:** OCR-Agent

**Agent Kontext:**
Der OCR-Agent ist spezialisiert auf die Texterkennung und -extraktion aus Bild- und Dokumentdateien. Er verwendet Tesseract.js-Technologie zur Erkennung von gedrucktem und handgeschriebenem Text und unterstützt mehrere Sprachen mit Schwerpunkt auf Deutsch für Schweizer Dokumente.

**Konversation Kontext:**
Der OCR-Agent hat keine direkte Kundeninteraktion. Er wird von anderen Agenten aufgerufen, wenn Textextraktion aus Bildern oder gescannten Dokumenten erforderlich ist. Er kommuniziert über standardisierte Agent-Schnittstellen.

**Knowledge Kontext:**
Der OCR-Agent verfügt über Kenntnisse der Tesseract.js-Konfiguration, unterstützter Dateiformate und Sprachmodelle. Er implementiert das BaseAgent-Pattern und verwendet strukturierte Input/Output-Interfaces für konsistente Kommunikation.

**Was er für Programme brauchen wird:**
- Tesseract.js für OCR-Verarbeitung
- TypeScript für typsichere Agent-Entwicklung
- BaseAgent-Klasse für standardisierte Agent-Architektur
- OCRService für zentrale OCR-Funktionalität
- Dateisystem-Zugriff für Bildverarbeitung
- Image-Preprocessing-Utilities

**Agenten-Aufgaben und detaillierte Vorgehensweise:**

1. **Input-Validierung:**
   - Input: OCRAgentInput mit Bildpfad und Optionen
   - Validierung: Überprüfung der Dateipfad-Existenz
   - Format-Check: Unterstützte Erweiterungen (.jpg, .jpeg, .png, .tiff, .tif, .bmp, .pdf)
   - Fehlerbehandlung: Strukturierte Fehlermeldungen bei ungültigen Inputs

2. **Sprach- und Optionskonfiguration:**
   - Standard-Sprache: Deutsch ('deu')
   - Bild-Enhancement: Standardmäßig aktiviert
   - Timeout-Konfiguration: 120 Sekunden Standard
   - Sprachvalidierung: Überprüfung der Tesseract-Sprachunterstützung

3. **OCR-Verarbeitung:**
   - Bildvorverarbeitung zur Verbesserung der Texterkennung
   - Tesseract.js-Ausführung mit konfigurierten Parametern
   - Konfidenz-Score-Extraktion für Qualitätsbewertung
   - Metadaten-Sammlung über Verarbeitungszeit und verwendete Modelle

4. **Ergebnis-Strukturierung:**
   - Output: OCRAgentOutput mit extrahiertem Text
   - Konfidenz-Score: Numerischer Wert für Erkennungsqualität
   - Sprach-Erkennung: Identifizierte Textsprache
   - Zeitstempel: Verarbeitungszeit für Audit-Zwecke
   - Metadaten: Zusätzliche Verarbeitungsinformationen

5. **Error Handling und Logging:**
   - Try-Catch-Implementierung für robuste Fehlerbehandlung
   - AgentContext-Logging für Debugging und Monitoring
   - Strukturierte AgentResult-Rückgabe bei Erfolg und Fehlern

---

## **E-Mail-Agent - Detaillierte Übersicht**

**Agent Name:** E-Mail-Agent (EmailAgent)

**Agent Kontext:**
Der E-Mail-Agent überwacht eingehende E-Mails und klassifiziert sie automatisch nach Inhalt und Anhängen. Er verarbeitet Dokumentenanhänge, generiert kontextuelle Antworten in deutscher Sprache und eskaliert komplexe Anfragen an menschliche Mitarbeiter. Der Agent arbeitet mit einem Polling-System für kontinuierliche E-Mail-Überwachung.

**Konversation Kontext:**
Der E-Mail-Agent interagiert direkt mit Kunden über E-Mail-Kommunikation. Er analysiert eingehende Nachrichten, klassifiziert Kundenanliegen und generiert automatisierte Antworten. Bei komplexen Fällen leitet er Anfragen an designierte Eskalations-E-Mail-Adressen weiter.

**Knowledge Kontext:**
Der E-Mail-Agent nutzt OpenAI GPT-4 für E-Mail-Klassifizierung und Antwortgenerierung. Er greift auf FAQ-Datenbanken zu und verwendet vordefinierte Klassifizierungskategorien. Der Agent verfügt über Escalation-Workflows und E-Mail-Template-Systeme.

**Was er für Programme brauchen wird:**
- OpenAI GPT-4 API für E-Mail-Klassifizierung und Antwortgenerierung
- EmailService für SMTP/IMAP-Integration
- DocumentAgent-Integration für Anhang-Verarbeitung
- Supabase für E-Mail-Logging und FAQ-Zugriff
- Resend oder ähnlicher E-Mail-Service für Versand
- Environment-Variable-Validation für API-Keys

**Agenten-Aufgaben und detaillierte Vorgehensweise:**

1. **E-Mail-Klassifizierung:**
   - Input: E-Mail-Objekt mit Betreff, Inhalt und Anhängen
   - GPT-4-Analyse: Klassifizierung in vordefinierte Kategorien
   - Kategorien: DOCUMENT_SUBMISSION, QUESTION, APPOINTMENT_REQUEST, FEEDBACK, OTHER
   - Konfidenz-Bewertung: Numerischer Score für Klassifizierungsqualität
   - JSON-strukturierte Antwort mit Typ, Konfidenz und Zusammenfassung

2. **Dokumentenanhang-Verarbeitung:**
   - Anhang-Validierung: Überprüfung von Dateityp und Größe
   - Unterstützte Formate: PDF, DOCX, JPG, JPEG, PNG, TIFF
   - Größenlimit: 20MB Gesamtgröße pro E-Mail
   - Document-Agent-Integration: Weiterleitung validierter Anhänge
   - Bestätigungs-E-Mail: Automatischer Versand mit Tracking-Informationen

3. **FAQ-basierte Fragenbehandlung:**
   - FAQ-Datenbank-Zugriff: Suche nach relevanten Antworten
   - GPT-4-Antwortgenerierung: Kontextuelle deutsche Antworten
   - Template-System: Strukturierte E-Mail-Antworten
   - Fallback-Mechanismus: Standard-Antworten bei GPT-4-Fehlern

4. **Termin- und Feedback-Handling:**
   - Terminanfragen: Professionelle Bestätigung und Weiterleitung
   - Feedback-Speicherung: Strukturierte Datenbank-Einträge
   - Management-Benachrichtigung: Sofortige Eskalation wichtiger Feedback
   - Status-Tracking: Vollständige Audit-Trails für alle Anfragen

5. **Eskalations-System:**
   - Automatische Weiterleitung komplexer Fälle
   - E-Mail-Forwarding mit Kontext-Informationen
   - Datenbank-Logging: Eskalations-Gründe und Status-Updates
   - Human-Handoff: Strukturierte Übergabe an menschliche Mitarbeiter

6. **Monitoring und Logging:**
   - Vollständige E-Mail-Verarbeitungs-Protokolle
   - Klassifizierungs-Statistiken und Konfidenz-Tracking
   - Fehler-Protokollierung für System-Optimierung
   - Performance-Metriken für Response-Zeiten

---

## **Zusätzliche Systemanforderungen:**

**Modularität:** Alle Agenten sind als eigenständige Module implementiert mit klaren Schnittstellen und Dependency Injection.

**Zuverlässigkeit:** Comprehensive Error Handling, Retry-Mechanismen und Fallback-Strategien in allen Agenten.

**Sicherheit:** Environment-Variable-basierte Konfiguration, Input-Validierung und sichere API-Integration.

**Erweiterbarkeit:** Interface-basierte Architektur ermöglicht einfache Erweiterung und Modifikation der Agenten-Funktionalität.

**Monitoring:** Detaillierte Logging-Systeme und Status-Tracking für alle Agent-Aktivitäten.
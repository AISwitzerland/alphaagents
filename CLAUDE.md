
# Claude Memory

## Projekt: AlphaAgents OCR Dokumentenmanagement System

### Projektübersicht
- **Zielgruppe**: Versicherungsunternehmen in der Schweiz
- **Hauptziel**: Multi-Agenten OCR Dokumentenverarbeitungssystem
- **Primäre Sprache**: Deutsch (Schweizerdeutsch Support)
- **Bereitstellung**: Produktionsreif mit 24/7 Betrieb

### Technologie-Stack
- **KI**: OpenAI GPT
- **Backend**: Supabase
- **Integration**: Google (E-Mail & Kalender)
- **Unterstützte Formate**: Word, PDF, JPG, PNG

### Systemarchitektur
- Multi-Agenten System mit spezialisierten KI-Agenten
- Dependency Injection zwischen Agenten
- Schweizer Datenschutzstandards
- Testgetriebene Entwicklung
- Umfassende Protokollierung

### Definierte Agenten (Aktualisierte Spezifikation)
1. **Manager-Agent** - System-Überwachung, Fehlerbehandlung & automatische Recovery
2. **Chat-Agent** - Website-Integration (Termine, Upload, FAQ) mit GPT-4
3. **Document-Agent** - Dokumentvalidierung, Speicherung & Supabase Integration
4. **OCR-Agent** - **GPT-4o Vision** Texterkennung für DE/CH Dokumente
5. **E-Mail-Agent** - SMTP/IMAP Monitoring, GPT-4 Klassifizierung & Antworten

### Zusätzliche ursprüngliche Agenten
6. **Schadenmelde-Agent** - Airtable Schadenmeldung Monitoring
7. **Termin-Agent** - Tägliche Terminzusammenfassungen

### Technische Integration
- **Airtable**: Schadenmeldungen, Termine, Benutzerdaten
- **Sendgrid**: E-Mail Versand & Empfang
- **Knowledge Base**: FAQ & vorgefertigte Antworten
- **Kalender-Widget**: Terminbuchung mit Time Slots
- **Drag & Drop**: Dokumenten-Upload Interface

### Status Update
1. ✅ Phase 1: Fundament (BaseAgent, DI Container, Error Handling)
2. ✅ Phase 2: Core Services (Config, Logger, Supabase, OpenAI)
3. ✅ Phase 3: Core Agenten (Manager, Document, OCR)
4. ✅ Phase 4: Customer Interaction (E-Mail & Chat Agenten)
5. 🚀 Phase 5: Integration & Frontend (CURRENT)

### Agenten-Priorität
1. **Manager-Agent** - System-Überwachung (orchestriert alle)
2. **Document-Agent** - File-Handling Basis
3. **OCR-Agent** - GPT-4o Vision Processing
4. **Chat-Agent** & **E-Mail-Agent** - Kundeninteraktion

## Current Session
- Date: 22.5.2025
- Model: claude-sonnet-4-20250514
- Role: Senior AI Systemarchitekt und Full-Stack-Entwickler

## Important Notes
- Keep responses concise (fewer than 4 lines unless detail requested)
- Prefer editing existing files over creating new ones
- Only create documentation files when explicitly requested
- Clean up test/debug files when no longer needed
- Always check for lint/typecheck commands and run them after code changes

## Error Prevention Guidelines (Added: 23.5.2025)
**API Konsistenz prüfen:**
- Logger Service: Alle verwendeten Methoden (debug, info, warn, error, fatal) implementieren
- Type Interfaces: Alle verwendeten Properties in LogContext definieren  
- Error Codes: Alle verwendeten Codes in ErrorCodes enum und isFatalError() Liste
- Test vor Produktion: `pnpm test:services` und `pnpm run dev` vor finale Bereitstellung
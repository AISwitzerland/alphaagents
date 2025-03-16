-- Dokumentklassifizierungstabelle
CREATE TABLE IF NOT EXISTS document_classifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL,
    document_name TEXT NOT NULL,
    filename_classification VARCHAR(100),
    filename_confidence FLOAT,
    ai_classification VARCHAR(100),
    ai_confidence FLOAT,
    final_classification VARCHAR(100),
    processing_time_ms INTEGER,
    classification_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index für schnellere Abfragen
CREATE INDEX IF NOT EXISTS idx_document_classifications_document_id ON document_classifications(document_id);
CREATE INDEX IF NOT EXISTS idx_document_classifications_final ON document_classifications(final_classification);

-- Feedback-Tabelle für Klassifizierungen
CREATE TABLE IF NOT EXISTS classification_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classification_id UUID NOT NULL REFERENCES document_classifications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    original_classification VARCHAR(100) NOT NULL,
    corrected_classification VARCHAR(100) NOT NULL,
    user_confidence INTEGER NOT NULL CHECK (user_confidence BETWEEN 1 AND 5),
    feedback_notes TEXT,
    feedback_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applied_to_learning BOOLEAN DEFAULT FALSE,
    applied_timestamp TIMESTAMP WITH TIME ZONE
);

-- Index für schnellere Abfragen
CREATE INDEX IF NOT EXISTS idx_classification_feedback_classification_id ON classification_feedback(classification_id);
CREATE INDEX IF NOT EXISTS idx_classification_feedback_applied ON classification_feedback(applied_to_learning);

-- Tabelle für Lernzyklen (wann Feedback angewendet wurde)
CREATE TABLE IF NOT EXISTS learning_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applied_feedback_count INTEGER NOT NULL,
    cycle_notes TEXT,
    changes_summary JSONB NOT NULL,
    performed_by_user_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'completed'
);

-- Nachverfolgungstabelle für Keyword-Updates
CREATE TABLE IF NOT EXISTS keyword_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_cycle_id UUID REFERENCES learning_cycles(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    keyword TEXT NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'added', 'removed', 'weight_adjusted'
    previous_weight FLOAT,
    new_weight FLOAT,
    update_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabelle mit verfügbaren Dokumenttypen (für UI-Dropdowns)
CREATE TABLE IF NOT EXISTS document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Einfügen von Beispiel-Dokumenttypen
INSERT INTO document_types (type_name, description)
VALUES 
    ('Rechnung', 'Rechnungsdokumente von Lieferanten'),
    ('Vertrag', 'Vertragsdokumente mit Kunden oder Lieferanten'),
    ('Angebot', 'Angebote von Lieferanten'),
    ('Mahnung', 'Mahnungen für offene Zahlungen'),
    ('Personalakte', 'Dokumente bezüglich Mitarbeitern'),
    ('Steuerunterlagen', 'Steuerrelevante Dokumente')
ON CONFLICT (type_name) DO NOTHING;

-- Funktion zur Aktualisierung des updated_at-Timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für document_types
CREATE TRIGGER update_document_types_timestamp
BEFORE UPDATE ON document_types
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Kommentare zu den Tabellen
COMMENT ON TABLE document_classifications IS 'Speichert alle Dokumentklassifizierungsergebnisse, einschließlich KI- und regelbasierter Methoden';
COMMENT ON TABLE classification_feedback IS 'Speichert Benutzer-Feedback zu Klassifizierungsergebnissen';
COMMENT ON TABLE learning_cycles IS 'Protokolliert, wann und wie Feedback zur Verbesserung des Systems verwendet wurde';
COMMENT ON TABLE keyword_updates IS 'Verfolgt Änderungen an Schlüsselwörtern für die dateinamenbasierte Klassifizierung';
COMMENT ON TABLE document_types IS 'Hauptliste der verfügbaren Dokumenttypen im System'; 
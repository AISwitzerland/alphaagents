-- Supabase SQL-Funktionen für das Feedback-System

-- Funktion, um Feedback nach Dokumenttyp zu gruppieren
CREATE OR REPLACE FUNCTION get_feedback_by_document_type()
RETURNS TABLE (
  document_type TEXT,
  count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    corrected_classification AS document_type,
    COUNT(*) AS count
  FROM classification_feedback
  WHERE applied_to_learning = false
  GROUP BY corrected_classification
  ORDER BY count DESC;
$$;

-- Funktion, um Feedback nach Konfidenzlevel zu gruppieren
CREATE OR REPLACE FUNCTION get_feedback_by_confidence()
RETURNS TABLE (
  confidence_level INTEGER,
  count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    user_confidence AS confidence_level,
    COUNT(*) AS count
  FROM classification_feedback
  GROUP BY user_confidence
  ORDER BY confidence_level;
$$;

-- Funktion, um die gesamte Genauigkeit des Klassifizierungssystems zu berechnen
CREATE OR REPLACE FUNCTION get_classification_accuracy()
RETURNS TABLE (
  total_classifications BIGINT,
  correct_classifications BIGINT,
  accuracy_percentage NUMERIC
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  WITH 
  -- Alle Dokumente mit Feedback
  docs_with_feedback AS (
    SELECT 
      dc.id,
      dc.final_classification,
      cf.corrected_classification
    FROM document_classifications dc
    JOIN classification_feedback cf ON dc.id = cf.classification_id
  ),
  -- Zählungen berechnen
  counts AS (
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN final_classification = corrected_classification THEN 1 ELSE 0 END) AS correct
    FROM docs_with_feedback
  )
  SELECT
    total AS total_classifications,
    correct AS correct_classifications,
    CASE WHEN total > 0 THEN (correct::NUMERIC / total::NUMERIC) * 100 ELSE 0 END AS accuracy_percentage
  FROM counts;
$$;

-- Funktion, um Verbesserungsvorschläge für Schlüsselwörter basierend auf Feedback zu generieren
CREATE OR REPLACE FUNCTION generate_keyword_suggestions()
RETURNS TABLE (
  document_type TEXT,
  suggested_keyword TEXT,
  occurrence_count BIGINT,
  confidence_score NUMERIC
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  -- Diese Abfrage ist ein Beispiel und muss angepasst werden, 
  -- basierend auf der tatsächlichen Implementierung der Schlüsselwörter
  WITH 
  -- Feedback-Paare, die Korrekturen enthalten
  correction_pairs AS (
    SELECT 
      cf.original_classification,
      cf.corrected_classification,
      cf.user_confidence,
      dc.document_name
    FROM classification_feedback cf
    JOIN document_classifications dc ON cf.classification_id = dc.id
    WHERE cf.original_classification != cf.corrected_classification
      AND cf.applied_to_learning = false
  )
  -- Hier würde eine komplexere Analyse folgen, die häufige Wörter in Dokumentnamen extrahiert
  -- und deren Korrelation mit bestimmten Dokumenttypen berechnet
  SELECT 
    corrected_classification AS document_type,
    -- Hier nur als Beispiel: Extrahieren des ersten Wortes des Dokumentnamens
    SPLIT_PART(LOWER(document_name), ' ', 1) AS suggested_keyword,
    COUNT(*) AS occurrence_count,
    AVG(user_confidence)::NUMERIC AS confidence_score
  FROM correction_pairs
  GROUP BY document_type, suggested_keyword
  HAVING COUNT(*) > 1  -- Nur vorschlagen, wenn es mehr als ein Vorkommen gibt
  ORDER BY document_type, occurrence_count DESC, confidence_score DESC;
$$;

-- Rechteverwaltung für die Funktionen
GRANT EXECUTE ON FUNCTION get_feedback_by_document_type TO authenticated;
GRANT EXECUTE ON FUNCTION get_feedback_by_confidence TO authenticated;
GRANT EXECUTE ON FUNCTION get_classification_accuracy TO authenticated;
GRANT EXECUTE ON FUNCTION generate_keyword_suggestions TO authenticated; 
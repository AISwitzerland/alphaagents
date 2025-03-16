import type { NextApiRequest, NextApiResponse } from 'next';
import DocumentCoordinationAgent from '../../../../services/DocumentCoordinationAgent';

/**
 * API-Endpunkt zur Statusabfrage eines Dokuments
 * 
 * Dieser Endpunkt gibt den aktuellen Verarbeitungsstatus eines Dokuments zurück.
 * Die Dokument-ID wird als URL-Parameter übergeben.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Nur GET-Anfragen erlauben
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Dokument-ID aus der URL extrahieren
    const { id } = req.query;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid document ID is required'
      });
    }

    // Status vom Koordinationsagenten abfragen
    const coordinationAgent = DocumentCoordinationAgent.getInstance();
    const status = coordinationAgent.getDocumentStatus(id);

    if (!status) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    // Sensible Daten aus der Antwort entfernen
    const safeResponse = {
      documentId: status.documentId,
      currentStage: status.currentStage,
      priority: status.priority,
      startTime: new Date(status.startTime).toISOString(),
      lastUpdated: new Date(status.lastUpdated).toISOString(),
      error: status.error,
      // Selektive Informationen aus dem Dokument
      document: {
        id: status.document.id,
        fileName: status.document.fileName,
        mimeType: status.document.mimeType,
        documentType: status.document.documentType,
        classificationConfidence: status.document.classificationConfidence
      },
      // Vereinfachter Verarbeitungsverlauf
      history: status.history.map(entry => ({
        stage: entry.stage,
        agent: entry.agent,
        startTime: new Date(entry.startTime).toISOString(),
        endTime: new Date(entry.endTime).toISOString(),
        success: entry.success
      }))
    };

    // Erfolgreiche Antwort zurückgeben
    return res.status(200).json({
      success: true,
      status: safeResponse
    });
  } catch (error) {
    console.error('Error retrieving document status:', error);
    
    // Fehlerantwort zurückgeben
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
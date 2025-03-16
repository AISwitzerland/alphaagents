import type { NextApiRequest, NextApiResponse } from 'next';
import DocumentCoordinationAgent from '../../../services/DocumentCoordinationAgent';
import { Document } from '../../../types/document';

/**
 * API-Endpunkt zur Verarbeitung von Dokumenten
 * 
 * Dieser Endpunkt nimmt ein Dokument-Objekt entgegen und leitet es an den Koordinationsagenten weiter.
 * Er gibt eine Dokument-ID zurück, mit der der Fortschritt abgefragt werden kann.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Body validieren
    const { document, priority } = req.body;

    if (!document) {
      return res.status(400).json({
        success: false,
        error: 'Document is required'
      });
    }

    // Mindestforderungen an ein Dokument prüfen
    if (!document.fileName) {
      return res.status(400).json({
        success: false,
        error: 'Document fileName is required'
      });
    }

    // Dokument zur Verarbeitung an den Koordinationsagenten übergeben
    const coordinationAgent = DocumentCoordinationAgent.getInstance();
    const documentId = await coordinationAgent.processDocument(document as Document, priority);

    // Erfolgreiche Antwort zurückgeben
    return res.status(200).json({
      success: true,
      documentId,
      message: 'Document processing started'
    });
  } catch (error) {
    console.error('Error processing document:', error);
    
    // Fehlerantwort zurückgeben
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
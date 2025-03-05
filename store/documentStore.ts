import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Document, DocumentType, ProcessingStatus, DocumentMetadata } from '@/types/document';
import { supabase } from '@/services/supabaseClient';

interface DocumentState {
  // Lokaler Cache der Dokumente
  documents: Document[];
  // Synchronisationsstatus
  isLoading: boolean;
  error: string | null;
  lastSynced: Date | null;
  // Cache für Dokument-URLs
  documentUrls: Record<string, { url: string; expires: number }>;
  
  // Aktionen
  fetchDocuments: () => Promise<void>;
  addDocument: (document: Document) => Promise<void>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentById: (id: string) => Document | undefined;
  getDocumentsByStatus: (status: string) => Document[];
  getDocumentUrl: (documentId: string) => Promise<string | null>;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: [],
      isLoading: false,
      error: null,
      lastSynced: null,
      documentUrls: {},
      
      // Laden aller Dokumente aus Supabase
      fetchDocuments: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Daten aus Supabase abrufen
          const { data, error } = await supabase
            .from('documents')
            .select('*');
            
          if (error) throw error;
          
          // Sicherheitsmaßnahme: Wenn data null oder undefined ist, setze ein leeres Array
          if (!data) {
            set({ 
              documents: [], 
              isLoading: false,
              lastSynced: new Date()
            });
            return;
          }
          
          // Daten transformieren in unser Document-Format
          const formattedDocuments: Document[] = data.map(item => ({
            id: item.id,
            type: item.document_type as DocumentType,
            status: {
              status: item.status,
              progress: 100, // Standardwert
            },
            metadata: item.metadata as DocumentMetadata,
            filePath: item.file_path,
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }));
          
          set({ 
            documents: formattedDocuments, 
            isLoading: false,
            lastSynced: new Date()
          });
        } catch (error) {
          console.error('Fehler beim Laden der Dokumente:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Unbekannter Fehler', 
            isLoading: false 
          });
        }
      },
      
      // Hinzufügen eines neuen Dokuments lokal und in Supabase
      addDocument: async (document: Document) => {
        try {
          set({ isLoading: true, error: null });
          
          // Zuerst zu Supabase hinzufügen
          const { data, error } = await supabase
            .from('documents')
            .insert({
              id: document.id,
              file_name: document.metadata.originalName,
              file_path: document.filePath,
              file_type: document.metadata.mimeType,
              document_type: document.type,
              status: document.status.status,
              metadata: document.metadata,
              uploaded_by: document.metadata.uploadedBy.id || '550e8400-e29b-41d4-a716-446655440000',
              created_at: document.createdAt,
              updated_at: document.updatedAt
            })
            .select()
            .single();
            
          if (error) throw error;
          
          // Nach erfolgreicher DB-Operation lokal hinzufügen
          set(state => ({
            documents: [...state.documents, document],
            isLoading: false,
            lastSynced: new Date()
          }));
        } catch (err: any) {
          console.error('Fehler beim Hinzufügen des Dokuments:', err.message);
          set({ isLoading: false, error: err.message });
        }
      },
      
      // Aktualisieren eines Dokuments lokal und in Supabase
      updateDocument: async (id: string, updates: Partial<Document>) => {
        try {
          set({ isLoading: true, error: null });
          
          const existingDoc = get().documents.find(doc => doc.id === id);
          if (!existingDoc) throw new Error('Dokument nicht gefunden');
          
          // Zuerst in Supabase aktualisieren
          const dbUpdates: Record<string, any> = {};
          
          if (updates.type) dbUpdates.document_type = updates.type;
          if (updates.status) dbUpdates.status = updates.status.status;
          if (updates.metadata) dbUpdates.metadata = { ...existingDoc.metadata, ...updates.metadata };
          if (updates.filePath) dbUpdates.file_path = updates.filePath;
          
          dbUpdates.updated_at = new Date().toISOString();
          
          const { error } = await supabase
            .from('documents')
            .update(dbUpdates)
            .eq('id', id);
            
          if (error) throw error;
          
          // Nach erfolgreicher DB-Operation lokal aktualisieren
          set(state => ({
            documents: state.documents.map(doc => 
              doc.id === id 
                ? { ...doc, ...updates, updatedAt: new Date().toISOString() } 
                : doc
            ),
            isLoading: false,
            lastSynced: new Date()
          }));
        } catch (err: any) {
          console.error('Fehler beim Aktualisieren des Dokuments:', err.message);
          set({ isLoading: false, error: err.message });
        }
      },
      
      // Löschen eines Dokuments lokal und in Supabase
      deleteDocument: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Zuerst aus Supabase löschen
          const { error } = await supabase
            .from('documents')
            .delete()
            .eq('id', id);
            
          if (error) throw error;
          
          // Nach erfolgreicher DB-Operation lokal löschen
          set(state => ({
            documents: state.documents.filter(doc => doc.id !== id),
            isLoading: false,
            lastSynced: new Date()
          }));
        } catch (err: any) {
          console.error('Fehler beim Löschen des Dokuments:', err.message);
          set({ isLoading: false, error: err.message });
        }
      },
      
      // Hilfsfunktionen zum Abrufen von Dokumenten
      getDocumentById: (id: string) => {
        return get().documents.find(doc => doc.id === id);
      },
      
      getDocumentsByStatus: (status: string) => {
        return get().documents.filter(doc => doc.status.status === status);
      },
      
      // Neue Methode zur Erstellung von signierten URLs für Dokumente
      getDocumentUrl: async (documentId: string) => {
        const { documentUrls, documents } = get();
        
        // Prüfen, ob wir bereits eine gültige URL im Cache haben
        const cachedUrl = documentUrls[documentId];
        if (cachedUrl && cachedUrl.expires > Date.now()) {
          return cachedUrl.url;
        }
        
        // Dokument aus dem Store holen
        const document = documents.find(doc => doc.id === documentId);
        if (!document || !document.filePath) {
          console.error('Dokument nicht gefunden oder hat keinen Dateipfad:', documentId);
          return null;
        }
        
        try {
          // Signierte URL für 1 Stunde erstellen
          const { data, error } = await supabase.storage
            .from('documents')
            .createSignedUrl(document.filePath, 3600);
          
          if (error) {
            console.error('Fehler beim Erstellen der signierten URL:', error);
            return null;
          }
          
          // URL im Cache speichern (Ablauf in 55 Minuten, um etwas Puffer zu haben)
          const expiresAt = Date.now() + 55 * 60 * 1000;
          set({
            documentUrls: {
              ...documentUrls,
              [documentId]: {
                url: data.signedUrl,
                expires: expiresAt
              }
            }
          });
          
          return data.signedUrl;
        } catch (error) {
          console.error('Fehler beim Abrufen der Dokument-URL:', error);
          return null;
        }
      }
    }),
    {
      name: 'document-storage', // Name des Speichers für localStorage
      partialize: (state) => ({ documents: state.documents }), // Nur die Dokumente selbst persistieren
    }
  )
); 
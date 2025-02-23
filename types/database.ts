export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          file_name: string
          file_path: string
          file_type: string
          document_type: string
          status: string
          metadata: Json
          uploaded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          file_name: string
          file_path: string
          file_type: string
          document_type: string
          status?: string
          metadata?: Json
          uploaded_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          file_name?: string
          file_path?: string
          file_type?: string
          document_type?: string
          status?: string
          metadata?: Json
          uploaded_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      processing_status: {
        Row: {
          id: string
          process_id: string
          document_id: string
          status: string
          progress: number
          message: string | null
          error: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          process_id: string
          document_id: string
          status?: string
          progress?: number
          message?: string | null
          error?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          process_id?: string
          document_id?: string
          status?: string
          progress?: number
          message?: string | null
          error?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      extracted_data: {
        Row: {
          id: string
          document_id: string
          data: Json
          confidence_score: number
          extraction_method: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          data: Json
          confidence_score: number
          extraction_method: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          data?: Json
          confidence_score?: number
          extraction_method?: string
          created_at?: string
          updated_at?: string
        }
      }
      accident_reports: {
        Row: {
          id: string
          document_id: string
          name: string
          geburtsdatum: string
          ahv_nummer: string
          unfall_datum: string
          unfall_zeit: string
          unfall_ort: string
          unfall_beschreibung: string
          verletzung_art: string
          verletzung_koerperteil: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          name: string
          geburtsdatum: string
          ahv_nummer: string
          unfall_datum: string
          unfall_zeit: string
          unfall_ort: string
          unfall_beschreibung: string
          verletzung_art: string
          verletzung_koerperteil: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          name?: string
          geburtsdatum?: string
          ahv_nummer?: string
          unfall_datum?: string
          unfall_zeit?: string
          unfall_ort?: string
          unfall_beschreibung?: string
          verletzung_art?: string
          verletzung_koerperteil?: string
          created_at?: string
          updated_at?: string
        }
      }
      damage_reports: {
        Row: {
          id: string
          document_id: string
          versicherungsnummer: string
          name: string
          adresse: string
          schaden_datum: string
          schaden_ort: string
          schaden_beschreibung: string
          zusammenfassung: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          versicherungsnummer: string
          name: string
          adresse: string
          schaden_datum: string
          schaden_ort: string
          schaden_beschreibung: string
          zusammenfassung: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          versicherungsnummer?: string
          name?: string
          adresse?: string
          schaden_datum?: string
          schaden_ort?: string
          schaden_beschreibung?: string
          zusammenfassung?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      contract_changes: {
        Row: {
          id: string
          document_id: string
          name: string
          adresse: string
          aenderung_typ: string
          aenderung_beschreibung: string
          zusammenfassung: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          name: string
          adresse: string
          aenderung_typ: string
          aenderung_beschreibung: string
          zusammenfassung: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          name?: string
          adresse?: string
          aenderung_typ?: string
          aenderung_beschreibung?: string
          zusammenfassung?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          termin_datum: string
          name: string
          email: string
          telefon: string
          notizen: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          termin_datum: string
          name: string
          email: string
          telefon: string
          notizen?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          termin_datum?: string
          name?: string
          email?: string
          telefon?: string
          notizen?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      miscellaneous_documents: {
        Row: {
          id: string
          document_id: string
          title: string
          document_date: string
          summary: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          title: string
          document_date: string
          summary: string
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          title?: string
          document_date?: string
          summary?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          user_id: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          content: string
          role: 'user' | 'assistant'
          attachments?: string[]
          intent?: string
          sentiment?: string
          language?: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          content: string
          role: 'user' | 'assistant'
          attachments?: string[]
          intent?: string
          sentiment?: string
          language?: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          content?: string
          role?: 'user' | 'assistant'
          attachments?: string[]
          intent?: string
          sentiment?: string
          language?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables = Database['public']['Tables']; 
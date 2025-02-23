import { supabase } from './supabaseClient';
import { Database } from '@/types/database';
import { DocumentType } from '@/types/document';

type Tables = Database['public']['Tables'];

export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Documents
  async createDocument(data: Omit<Tables['documents']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data: document, error } = await supabase
      .from('documents')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return document;
  }

  async getDocument(id: string) {
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return document;
  }

  async updateDocument(id: string, data: Tables['documents']['Update']) {
    const { data: document, error } = await supabase
      .from('documents')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return document;
  }

  async deleteDocument(id: string) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async listDocuments(filters?: {
    type?: DocumentType;
    status?: string;
    uploadedBy?: string;
  }) {
    let query = supabase.from('documents').select('*');

    if (filters?.type) {
      query = query.eq('document_type', filters.type);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.uploadedBy) {
      query = query.eq('uploaded_by', filters.uploadedBy);
    }

    const { data: documents, error } = await query;

    if (error) throw error;
    return documents;
  }

  // Processing Status
  async updateProcessingStatus(processId: string, data: Partial<Tables['processing_status']['Update']>) {
    const { data: status, error } = await supabase
      .from('processing_status')
      .upsert({
        process_id: processId,
        ...data,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return status;
  }

  async getProcessingStatus(processId: string) {
    const { data: status, error } = await supabase
      .from('processing_status')
      .select('*')
      .eq('process_id', processId)
      .single();

    if (error) throw error;
    return status;
  }

  // Extracted Data
  async saveExtractedData(data: Omit<Tables['extracted_data']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data: extractedData, error } = await supabase
      .from('extracted_data')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return extractedData;
  }

  async getExtractedData(documentId: string) {
    const { data: extractedData, error } = await supabase
      .from('extracted_data')
      .select('*')
      .eq('document_id', documentId)
      .single();

    if (error) throw error;
    return extractedData;
  }

  // Accident Reports
  async createAccidentReport(data: Omit<Tables['accident_reports']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data: report, error } = await supabase
      .from('accident_reports')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return report;
  }

  async getAccidentReport(id: string) {
    const { data: report, error } = await supabase
      .from('accident_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return report;
  }

  async updateAccidentReport(id: string, data: Tables['accident_reports']['Update']) {
    const { data: report, error } = await supabase
      .from('accident_reports')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return report;
  }

  // Damage Reports
  async createDamageReport(data: Omit<Tables['damage_reports']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data: report, error } = await supabase
      .from('damage_reports')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return report;
  }

  async getDamageReport(id: string) {
    const { data: report, error } = await supabase
      .from('damage_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return report;
  }

  async updateDamageReport(id: string, data: Tables['damage_reports']['Update']) {
    const { data: report, error } = await supabase
      .from('damage_reports')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return report;
  }

  // Contract Changes
  async createContractChange(data: Omit<Tables['contract_changes']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data: change, error } = await supabase
      .from('contract_changes')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return change;
  }

  async getContractChange(id: string) {
    const { data: change, error } = await supabase
      .from('contract_changes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return change;
  }

  async updateContractChange(id: string, data: Tables['contract_changes']['Update']) {
    const { data: change, error } = await supabase
      .from('contract_changes')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return change;
  }

  // Appointments
  async createAppointment(data: Omit<Tables['appointments']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return appointment;
  }

  async getAppointment(id: string) {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return appointment;
  }

  async updateAppointment(id: string, data: Tables['appointments']['Update']) {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return appointment;
  }

  async listAppointments(filters?: {
    startDate?: string;
    endDate?: string;
    email?: string;
  }) {
    let query = supabase.from('appointments').select('*');

    if (filters?.startDate) {
      query = query.gte('termin_datum', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('termin_datum', filters.endDate);
    }
    if (filters?.email) {
      query = query.eq('email', filters.email);
    }

    const { data: appointments, error } = await query;

    if (error) throw error;
    return appointments;
  }

  // Hilfsfunktionen
  async searchDocuments(searchTerm: string) {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .or(`file_name.ilike.%${searchTerm}%,metadata->>'content'.ilike.%${searchTerm}%`);

    if (error) throw error;
    return documents;
  }

  async getDocumentWithRelations(id: string) {
    const { data: document, error } = await supabase
      .from('documents')
      .select(`
        *,
        processing_status (*),
        extracted_data (*),
        accident_reports (*),
        damage_reports (*),
        contract_changes (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return document;
  }

  // Miscellaneous Documents
  async createMiscDocument(data: Omit<Tables['miscellaneous_documents']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data: document, error } = await supabase
      .from('miscellaneous_documents')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return document;
  }
} 
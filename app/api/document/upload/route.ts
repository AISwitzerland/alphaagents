import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/services/supabaseServerClient';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/types/constants';
import { Database } from '@/types/database';
import { processDocument, createAccidentReport, createDamageReport, createContractChange, createMiscDocument } from '@/services/documentProcessingService';
import { User } from '@supabase/supabase-js';

// Hilfsfunktion zum Parsen des deutschen Datums
function parseDEDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

const CHAT_SERVICE_ACCOUNT_ID = 'f0d0852b-df50-47b4-beb8-4a42bea0c464';

export async function POST(request: Request) {
  try {
    console.log('Upload API aufgerufen');
    const formData = await request.formData();
    
    // Identifiziere die Upload-Quelle
    const source = formData.get('source') as string || 'dashboard';
    console.log('Upload Quelle:', source);

    // Get auth token from header
    const authHeader = request.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);

    // Sammle Kontaktinformationen für Chat-Uploads
    const contactInfo = source === 'chat' ? {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string
    } : null;

    if (source === 'chat') {
      console.log('Chat Upload mit Kontaktinformationen:', contactInfo);
    }

    // Extrahiere File
    const file = formData.get('file') as File | null;
    console.log('Datei aus FormData extrahiert:', {
      vorhanden: !!file,
      name: file?.name,
      type: file?.type,
      size: file?.size
    });

    // Validierung
    if (!file) {
      return NextResponse.json(
        { error: 'Keine Datei gefunden' },
        { status: 400 }
      );
    }

    // Validiere Dateityp
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Nicht unterstützter Dateityp' },
        { status: 400 }
      );
    }

    // Validiere Dateigröße
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Datei ist zu groß' },
        { status: 400 }
      );
    }

    // Initialisiere Supabase-Client mit unserem Server-Client
    console.log('Initialisiere Supabase-Client...');
    const supabase = createServerSupabaseClient();

    // Get authenticated user (sicherer als getSession)
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log('Authenticated user found:', !!userData.user);

    if (userError) {
      console.error('User authentication error:', userError);
      return NextResponse.json(
        { error: 'Authentifizierungsfehler' },
        { status: 401 }
      );
    }

    let uploadUser: User | null = userData.user;

    // For chat uploads, authenticate as the chat service account if no user exists
    if (!uploadUser && source === 'chat') {
      console.log('Authenticating as chat service account...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'aiagent.test.demo@gmail.com',
        password: 'Test123'
      });

      if (authError) {
        console.error('Chat service authentication failed:', authError);
        return NextResponse.json(
          { error: 'Authentifizierungsfehler' },
          { status: 401 }
        );
      }

      uploadUser = authData.user;
      console.log('Successfully authenticated as chat service account');
    } else if (!uploadUser && source !== 'chat') {
      console.error('No authenticated user found and not a chat upload');
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Generiere eindeutigen Dateipfad
    const timestamp = Date.now();
    const sanitizedFileName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_');
    const filePath = `${uploadUser?.id || CHAT_SERVICE_ACCOUNT_ID}/${timestamp}-${sanitizedFileName}`;

    // Upload zur Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Fehler beim Hochladen der Datei' },
        { status: 500 }
      );
    }

    // Erstelle Datenbankeintrag
    const { data: dbData, error: dbError } = await supabase
      .from('documents')
      .insert({
        file_name: file.name,
        file_path: uploadData.path,
        file_type: file.type,
        document_type: 'unclassified',
        status: 'in_bearbeitung',
        metadata: {
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
          uploadedBy: source === 'chat' ? {
            name: contactInfo?.name,
            email: contactInfo?.email,
            phone: contactInfo?.phone,
            source: 'chat'
          } : {
            id: uploadUser?.id || CHAT_SERVICE_ACCOUNT_ID,
            email: uploadUser?.email || 'chat@example.com',
            source: 'dashboard'
          },
          uploadedAt: new Date().toISOString(),
          source: source
        },
        uploaded_by: uploadUser?.id || CHAT_SERVICE_ACCOUNT_ID
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return NextResponse.json(
        { error: 'Fehler beim Erstellen des Datenbankeintrags' },
        { status: 500 }
      );
    }

    // Starte Dokumentenverarbeitung
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    console.log('Starte Dokumentverarbeitung...');
    const processResult = await processDocument({
      fileContent: base64,
      fileType: file.type,
      metadata: {
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
        documentId: dbData.id,
        uploadedBy: source === 'chat' ? {
          name: contactInfo?.name,
          email: contactInfo?.email,
          phone: contactInfo?.phone,
          source: 'chat'
        } : {
          id: uploadUser?.id || CHAT_SERVICE_ACCOUNT_ID,
          email: uploadUser?.email || 'chat@example.com',
          source: 'dashboard'
        },
        uploadedAt: new Date().toISOString(),
        source: source
      }
    });

    if (processResult.error) {
      console.error('Fehler bei der Dokumentenverarbeitung:', processResult.error);
      await supabase
        .from('documents')
        .update({
          status: 'fehler',
          metadata: {
            ...dbData.metadata,
            error: processResult.error
          }
        })
        .eq('id', dbData.id);

      return NextResponse.json(
        { 
          error: 'Fehler bei der Dokumentenverarbeitung', 
          details: processResult.error 
        },
        { status: 500 }
      );
    }

    // Aktualisiere den Dokumenttyp und Status
    console.log('Dokumentverarbeitung erfolgreich, aktualisiere Dokumenttyp:', processResult.documentType);
    await supabase
      .from('documents')
      .update({
        document_type: processResult.documentType,
        status: 'verarbeitet',
        metadata: {
          ...dbData.metadata,
          ...processResult.metadata
        }
      })
      .eq('id', dbData.id);

    // Erstelle spezifischen Dokumenteintrag basierend auf dem Dokumenttyp
    try {
      console.log('Erstelle spezifischen Dokumenteintrag für Typ:', processResult.documentType);
      let specificDocumentResult;
      
      // Extrahiere die Daten aus dem Verarbeitungsergebnis
      const extractedData = processResult.metadata?.extractedData || {};
      
      // Wähle die entsprechende Funktion basierend auf dem Dokumenttyp
      switch (processResult.documentType) {
        case 'unfall':
          specificDocumentResult = await createAccidentReport(dbData.id, extractedData);
          break;
        case 'schaden':
          specificDocumentResult = await createDamageReport(dbData.id, extractedData);
          break;
        case 'vertragsänderung':
          specificDocumentResult = await createContractChange(dbData.id, extractedData);
          break;
        case 'misc':
        default:
          specificDocumentResult = await createMiscDocument(dbData.id, extractedData);
          break;
      }
      
      console.log('Spezifischer Dokumenteintrag erfolgreich erstellt:', specificDocumentResult);
    } catch (error) {
      console.error('Error creating specific document record:', error);
      // Wir geben hier keinen Fehler zurück, da der Upload selbst erfolgreich war
      // Aber wir loggen den Fehler für Debugging-Zwecke
    }

    // Erfolgreiche Antwort
    return NextResponse.json({
      success: true,
      documentId: dbData.id,
      documentType: processResult.documentType
    });

  } catch (error) {
    console.error('Unbehandelter Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler', details: error instanceof Error ? error.message : 'Unbekannter Fehler' },
      { status: 500 }
    );
  }
} 
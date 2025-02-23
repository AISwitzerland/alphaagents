import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
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

    // Initialisiere Supabase-Client
    console.log('Initialisiere Supabase-Client...');
    const cookieStore = cookies();
    
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set(name, value, options);
            } catch (error) {
              console.error('Error setting cookie:', error);
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 });
            } catch (error) {
              console.error('Error removing cookie:', error);
            }
          },
        },
        ...(authHeader ? {
          global: {
            headers: {
              Authorization: authHeader
            }
          }
        } : {})
      }
    );

    // Get the existing session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session found:', !!session);

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Authentifizierungsfehler' },
        { status: 401 }
      );
    }

    // For chat uploads, authenticate as the chat service account if no session exists
    if (!session && source === 'chat') {
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

      console.log('Successfully authenticated as chat service account');
    } else if (!session && source !== 'chat') {
      console.error('No session found and not a chat upload');
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const uploadUser = session?.user || {
      id: source === 'chat' ? CHAT_SERVICE_ACCOUNT_ID : 'unknown',
      email: contactInfo?.email || 'chat@example.com'
    };

    // Generiere eindeutigen Dateipfad
    const timestamp = Date.now();
    const sanitizedFileName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_');
    const filePath = `${uploadUser.id}/${timestamp}-${sanitizedFileName}`;

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
            id: uploadUser.id,
            email: uploadUser.email,
            source: 'dashboard'
          },
          uploadedAt: new Date().toISOString(),
          source: source
        },
        uploaded_by: uploadUser.id
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
          id: uploadUser.id,
          email: uploadUser.email,
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
        { error: 'Fehler bei der Dokumentenverarbeitung' },
        { status: 500 }
      );
    }

    // Connect classification to type-specific tables
    if (processResult.documentType && processResult.metadata?.extractedData) {
      try {
        switch(processResult.documentType) {
          case 'accident_report':
            await createAccidentReport(dbData.id, processResult.metadata.extractedData);
            break;
          case 'damage_report':
            await createDamageReport(dbData.id, processResult.metadata.extractedData);
            break;
          case 'contract_change':
            await createContractChange(dbData.id, processResult.metadata.extractedData);
            break;
          default:
            await createMiscDocument(dbData.id, processResult.metadata.extractedData);
        }
      } catch (error) {
        console.error('Error creating specific document record:', error);
        // Don't fail the upload if specific document creation fails
      }
    }

    // Erfolgreiche Verarbeitung
    return NextResponse.json({
      success: true,
      documentId: dbData.id,
      message: 'Dokument erfolgreich hochgeladen und wird verarbeitet'
    });

  } catch (error) {
    console.error('Unerwarteter Fehler:', error);
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
} 
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Automatische Anmeldung
const autoLogin = async () => {
  console.log('Starte automatische Anmeldung...');

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: 'aiagent.test.demo@gmail.com',
      password: 'Test123',
    });

    if (error) {
      console.error('Auto-Login fehlgeschlagen:', error.message);
      console.error('Fehlerdetails:', error);
    } else {
      console.log('Automatisch angemeldet als:', session?.user?.email);
      console.log('Session Details:', {
        accessToken: session?.access_token ? 'Vorhanden' : 'Fehlt',
        userId: session?.user?.id,
        expiresAt: session?.expires_at,
      });
    }
  } catch (e) {
    console.error('Unerwarteter Fehler beim Auto-Login:', e);
  }
};

// Führe die automatische Anmeldung durch
autoLogin();

// Hilfsfunktion für die Anmeldung
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// Hilfsfunktion für die Registrierung
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// Hilfsfunktionen für Dokumenten-Upload
export async function uploadDocumentToStorage(
  file: File,
  path: string
): Promise<{ path: string } | null> {
  try {
    const { data, error } = await supabase.storage.from('documents').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading document:', error);
    return null;
  }
}

// Hilfsfunktion zum Erstellen eines Dokumenteneintrags
export async function createDocumentEntry(
  fileName: string,
  filePath: string,
  fileType: string,
  metadata: any = {}
) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          file_name: fileName,
          file_path: filePath,
          file_type: fileType,
          status: 'pending',
          metadata,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating document entry:', error);
    return null;
  }
}

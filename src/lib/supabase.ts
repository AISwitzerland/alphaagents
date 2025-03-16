import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';

// Diese Umgebungsvariablen müssen in der .env-Datei definiert sein
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

// Client für Benutzer-Zugriff (öffentlich)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client für Server-Zugriff (privat, mit erweiterter Berechtigung)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Aktueller Benutzer abrufen
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error);
    return null;
  }
  return data?.user || null;
};

// Benutzerdefinierter Hook für Benutzer (alternative zu useUser aus auth-helpers)
export function useSupabaseUser() {
  'use client';
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aktuellen Benutzer abrufen
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Auf Änderungen des Auth-Status reagieren
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
} 
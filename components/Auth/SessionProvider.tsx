'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabaseClient';

// Definiere Kontexttypen
type SessionContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Erstelle den Kontext
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider-Komponente
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Lade die aktuelle Sitzung beim Mounten des Providers
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Fehler beim Laden der Sitzung:', error);
        } else {
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error('Unerwarteter Fehler beim Laden der Sitzung:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Abonniere Sitzungsänderungen
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        setLoading(false);
      }
    );

    // Bereinige Listener beim Unmounten
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Anmeldefunktion
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setSession(data.session);
      setUser(data.session?.user || null);
    } catch (error) {
      console.error('Anmeldefehler:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Abmeldefunktion
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Abmeldefehler:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signOut,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook für einfachen Zugriff auf den Kontext
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession muss innerhalb eines SessionProviders verwendet werden');
  }
  return context;
} 
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/services/supabaseServerClient';

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user, session: data.session });
  } catch (error) {
    console.error('Authentifizierungsfehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 
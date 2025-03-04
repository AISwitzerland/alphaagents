import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Einfache Sitzungs-Check Funktion
function isAuthenticated(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get('auth_session');
  return !!sessionCookie?.value;
}

export function middleware(request: NextRequest) {
  // Dashboard-Pfade schützen
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Überprüfe die Authentifizierung
    if (!isAuthenticated(request)) {
      // Nicht authentifiziert, umleiten zur Login-Seite
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Wenn auf /login zugegriffen wird und bereits angemeldet, zum Dashboard umleiten
  if (request.nextUrl.pathname === '/login' && isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Matcher für die Middleware (beschränkt die Ausführung auf bestimmte Pfade)
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}; 
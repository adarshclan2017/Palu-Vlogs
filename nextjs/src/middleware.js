import { NextResponse } from 'next/server';

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const payload = JSON.parse(json);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get('palu_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  const payload = token ? decodeJwtPayload(token) : null;
  const isAdmin = payload && payload.role === 'admin';

  // If already logged in, redirect away from /admin/login to /admin dashboard
  if (pathname === '/admin/login') {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      if (token) {
        response.cookies.delete('palu_token');
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth.js';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes EXCEPT /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token =
      request.cookies.get('palu_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('palu_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

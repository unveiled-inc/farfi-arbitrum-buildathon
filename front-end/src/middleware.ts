'use server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { deserialize } from 'wagmi';
import { permanentRedirect, redirect } from 'next/navigation';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const auth = request.cookies.get('1txauth')?.value;

    if (typeof auth === 'undefined' || auth === 'false') {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith('/signin')) {
    const auth = request.cookies.get('1txauth')?.value;

    if (auth === 'true') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }
  if (
    request.nextUrl.pathname.startsWith('/frame') ||
    request.nextUrl.pathname.startsWith('/yields')
  ) {
    const searchParms = request.nextUrl.searchParams;
    const frameName = searchParms.get('name');
    const imageData = searchParms.get('image');
    const fid = searchParms.get('fid');
    const baseUrl = request.nextUrl.origin.includes('localhost')
      ? `https://${request.headers.get('x-forwarded-host')}`
      : request.nextUrl.origin;

    const response = NextResponse.next();

    response.headers.set('1tx-frame-name', frameName || '');
    response.headers.set('base-url', baseUrl || '');
    response.headers.set('1tx-frame-image', imageData || '');
    response.headers.set('1tx-frame-fid', fid || '');

    return response;
  }
  if (request.nextUrl.pathname.startsWith('/api/frame')) {
    const searchParms = request.nextUrl.searchParams;
    const frameName = searchParms.get('name');
    const imageData = searchParms.get('image');
    const fid = searchParms.get('fid');
    const baseUrl = request.nextUrl.origin.includes('localhost')
      ? `https://${request.headers.get('x-forwarded-host')}`
      : request.nextUrl.origin;

    const response = NextResponse.next();

    response.headers.set('1tx-frame-name', frameName || '');
    response.headers.set('base-url', baseUrl || '');
    response.headers.set('1tx-frame-image', imageData || '');
    response.headers.set('1tx-frame-fid', fid || '');

    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/signin',
    '/frame/:path*',
    '/yields/:path*',
    '/api/frame/:path*',
  ],
};

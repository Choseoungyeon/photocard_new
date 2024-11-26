import { auth } from './auth';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/nextAuth/login') || pathname.startsWith('/nextAuth/register')) {
    if (session) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
}

export const config = {
  matcher: ['/nextAuth/login', '/nextAuth/register'],
};

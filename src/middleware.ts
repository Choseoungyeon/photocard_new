import { auth } from './auth';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  const protectedFromLoggedInUsers = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/set-total-user',
  ];

  for (const path of protectedFromLoggedInUsers) {
    if (pathname.startsWith(path)) {
      if (session) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  // if (pathname.startsWith('/create')) {
  //   if (!session) {
  //     return NextResponse.redirect(new URL('/login', req.url));
  //   }
  // }
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password/:path*',
    '/set-total-user',
    '/create',
  ],
};

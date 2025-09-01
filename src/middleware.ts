import { auth } from './auth';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  const protectedFromLoggedInUsers = ['/login', '/register'];

  for (const path of protectedFromLoggedInUsers) {
    if (pathname.startsWith(path)) {
      if (session) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  // 인증이 필요한 경로들
  const protectedRoutes = ['/create', '/gallery', '/mypage'];

  for (const path of protectedRoutes) {
    if (pathname.startsWith(path)) {
      if (!session) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  }
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password/:path*',
    '/set-total-user',
    '/create',
    '/gallery',
    '/mypage',
  ],
};

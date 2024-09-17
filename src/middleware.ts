import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/utils/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { supabase, response } = createMiddlewareClient(req)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If the user is not logged in and trying to access a protected route, redirect to the login page
  if (
    !user &&
    (req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/projects') ||
      req.nextUrl.pathname.startsWith('/versions'))
  ) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

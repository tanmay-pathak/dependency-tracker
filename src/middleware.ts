import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization')
  const url = request.nextUrl

  const validUser = process.env.BASIC_AUTH_USER
  const validPassword = process.env.BASIC_AUTH_PASSWORD

  if (!validUser || !validPassword) {
    return NextResponse.next()
  }

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === validUser && pwd === validPassword) {
      return NextResponse.next()
    }
  }

  url.pathname = '/api/basicauth'
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (root path)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|$).*)',
  ],
}

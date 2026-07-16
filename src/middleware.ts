import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const locales = ['zh', 'zh-Hant']
const defaultLocale = 'zh'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static assets, APIs, and next internals
  if (
    pathname.startsWith('/_next')
    || pathname.startsWith('/api')
    || pathname.includes('.')
    || pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Check if pathname starts with a supported locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) {
    // If the path starts with the default locale (zh), redirect to omit it
    if (pathname.startsWith(`/${defaultLocale}/`) || pathname === `/${defaultLocale}`) {
      const newPath = pathname.replace(`/${defaultLocale}`, '') || '/'
      const url = new URL(newPath + request.nextUrl.search, request.url)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // For paths without locale prefix, rewrite to defaultLocale (zh) internally
  const url = new URL(`/${defaultLocale}${pathname}${request.nextUrl.search}`, request.url)
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files
    '/((?!_next|api|.*\\..*).*)',
  ],
}

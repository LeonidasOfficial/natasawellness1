import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export const LOCALE_COOKIE = 'NEXT_LOCALE'
const ONE_YEAR = 60 * 60 * 24 * 365
const locales = routing.locales as readonly string[]

function isLocale(value: string | undefined): value is string {
  return !!value && locales.includes(value)
}

/**
 * - Prefixed URLs (/en/...): render as usual and remember the language in a
 *   cookie, so it sticks for the visitor.
 * - Unprefixed URLs (/, /pricelist, ...): send the visitor to the language
 *   they last used (cookie), instead of always falling back to Serbian.
 *   First-time visitors still get Serbian (the default).
 */
export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const firstSegment = pathname.split('/')[1]

  if (isLocale(firstSegment)) {
    const response = intlMiddleware(request)
    // Only remember real visits, not background link prefetches (e.g. the
    // language switcher links are prefetched for every language).
    const isPrefetch =
      request.headers.get('next-router-prefetch') === '1' ||
      request.headers.has('x-middleware-prefetch') ||
      request.headers.get('purpose') === 'prefetch'
    if (!isPrefetch && request.cookies.get(LOCALE_COOKIE)?.value !== firstSegment) {
      response.cookies.set(LOCALE_COOKIE, firstSegment, {
        path: '/',
        maxAge: ONE_YEAR,
        sameSite: 'lax',
      })
    }
    return response
  }

  const preferred = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(preferred)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${preferred}${pathname === '/' ? '' : pathname}`
    url.search = search
    return NextResponse.redirect(url)
  }

  return intlMiddleware(request)
}

export const config = {
  // Exclude admin and API routes from i18n routing
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
}

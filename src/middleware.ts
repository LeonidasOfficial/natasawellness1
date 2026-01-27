import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n/request'

export default createMiddleware({
  locales,
  defaultLocale: 'sr',
  localePrefix: 'always'
})

export const config = {
  // Exclude admin and API routes from i18n routing
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
}

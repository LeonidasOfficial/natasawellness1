import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Exclude admin and API routes from i18n routing
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
}

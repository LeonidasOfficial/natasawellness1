import { defineRouting } from 'next-intl/routing'
import { locales } from './request'

export const routing = defineRouting({
  locales,
  defaultLocale: 'sr',
  localePrefix: 'always',
  localeDetection: false,
  // The locale cookie is managed in src/middleware.ts (remembers the
  // visitor's chosen language without using browser-language detection).
  localeCookie: false,
})

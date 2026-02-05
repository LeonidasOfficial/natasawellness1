import { defineRouting } from 'next-intl/routing'
import { locales } from './request'

export const routing = defineRouting({
  locales,
  defaultLocale: 'sr',
  localePrefix: 'always',
  localeDetection: false,
})

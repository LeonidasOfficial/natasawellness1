'use client'

import { usePathname } from 'next/navigation'
import { useTranslation } from '@/contexts/TranslationContext'

export const SUPPORTED_LOCALES = ['sr', 'en', 'fr', 'de'] as const
const LOCALE_PREFIX = /^\/(sr|en|fr|de)(?=\/|$|\?|#)/

/**
 * Locale-aware links: every internal path gets the CURRENT language prefix,
 * so navigating never drops the visitor back to Serbian.
 */
export function useLocaleLink() {
  const pathname = usePathname() || '/'
  const { locale } = useTranslation()

  const fromPath = pathname.split('/')[1]
  const currentLocale = (SUPPORTED_LOCALES as readonly string[]).includes(fromPath)
    ? fromPath
    : locale || 'sr'

  const createLink = (path: string) => {
    if (!path) return `/${currentLocale}`
    // External links, anchors, mailto/tel are left untouched
    if (/^(https?:|mailto:|tel:|#)/.test(path)) return path
    // Already prefixed with a locale
    if (LOCALE_PREFIX.test(path)) return path

    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return cleanPath === '/' ? `/${currentLocale}` : `/${currentLocale}${cleanPath}`
  }

  return { createLink, currentLocale }
}

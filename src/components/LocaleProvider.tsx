'use client'

import { TranslationProvider } from '@/contexts/TranslationContext'

export default function LocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: string
}) {
  // This provider OVERRIDES the root TranslationProvider for locale-specific pages
  // The key prop forces a complete remount when locale changes, ensuring fresh state
  return (
    <TranslationProvider key={`locale-${locale}`} initialLocale={locale as 'en' | 'sr' | 'fr' | 'de'}>
      {children}
    </TranslationProvider>
  )
}

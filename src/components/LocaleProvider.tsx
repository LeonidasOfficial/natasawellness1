'use client'

import { TranslationProvider } from '@/contexts/TranslationContext'

export default function LocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: string
}) {
  return (
    <TranslationProvider initialLocale={locale as 'en' | 'sr' | 'fr' | 'de'}>
      {children}
    </TranslationProvider>
  )
}

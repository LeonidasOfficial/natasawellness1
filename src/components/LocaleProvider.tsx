'use client'

import { TranslationProvider } from '@/contexts/TranslationContext'
import { createContext, useContext } from 'react'

// Create a separate context to override the root TranslationProvider
const LocaleOverrideContext = createContext<string | undefined>(undefined)

export default function LocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: string
}) {
  // This provider OVERRIDES the root TranslationProvider for locale-specific pages
  // It creates a new TranslationProvider with the correct locale
  return (
    <TranslationProvider key={locale} initialLocale={locale as 'en' | 'sr' | 'fr' | 'de'}>
      {children}
    </TranslationProvider>
  )
}

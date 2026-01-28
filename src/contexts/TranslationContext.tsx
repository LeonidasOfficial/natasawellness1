'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

type Locale = 'en' | 'sr' | 'fr' | 'de'

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  translations: Record<string, any>
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ 
  children,
  initialLocale 
}: { 
  children: React.ReactNode
  initialLocale?: Locale
}) {
  const params = useParams()
  
  // Get initial locale from props, URL params, or default to 'sr'
  const getInitialLocale = (): Locale => {
    if (initialLocale && ['en', 'sr', 'fr', 'de'].includes(initialLocale)) {
      return initialLocale
    }
    if (params?.locale && ['en', 'sr', 'fr', 'de'].includes(params.locale as string)) {
      return params.locale as Locale
    }
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/').filter(Boolean)
      const urlLocale = pathSegments[0] as Locale
      if (['en', 'sr', 'fr', 'de'].includes(urlLocale)) {
        return urlLocale
      }
    }
    return 'sr'
  }
  
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale())
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Sync locale with URL params when they change
  useEffect(() => {
    const urlLocale = params?.locale as Locale
    if (urlLocale && ['en', 'sr', 'fr', 'de'].includes(urlLocale) && urlLocale !== locale) {
      setLocaleState(urlLocale)
      localStorage.setItem('locale', urlLocale)
    }
    setIsInitialized(true)
  }, [params?.locale, locale])

  // Load translations when locale changes
  useEffect(() => {
    if (!isInitialized) return

    const loadTranslations = async () => {
      try {
        // Try loading from public/locales first (for client-side)
        let response = await fetch(`/locales/${locale}.json`)
        if (!response.ok) {
          // Fallback to src/locales via API if needed
          response = await fetch(`/api/translations?locale=${locale}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        }
        const data = await response.json()
        setTranslations(data)
      } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error)
        // Fallback to empty translations to prevent blocking
        setTranslations({})
      }
    }

    loadTranslations()
  }, [locale, isInitialized])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  // Translation function with dot notation support
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t, translations }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

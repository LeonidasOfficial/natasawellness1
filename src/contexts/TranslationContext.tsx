'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

type Locale = 'en' | 'sr' | 'fr' | 'de'

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  translations: Record<string, unknown>
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ 
  children,
  initialLocale 
}: { 
  children: React.ReactNode
  initialLocale?: Locale
}) {
  // Use initialLocale prop directly, fallback to 'sr'
  const [locale, setLocaleState] = useState<Locale>(initialLocale || 'sr')
  const [translations, setTranslations] = useState<Record<string, unknown>>({})
  const [_isLoading, setIsLoading] = useState(true)

  // Sync locale with initialLocale prop when it changes
  useEffect(() => {
    if (initialLocale && initialLocale !== locale) {
      setLocaleState(initialLocale)
      setTranslations({}) // Clear translations to force reload
    }
  }, [initialLocale, locale])

  // Load translations when locale changes
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    const loadTranslations = async () => {
      try {
        // Try API route first (works in production)
        const response = await fetch(`/api/translations?locale=${locale}&t=${Date.now()}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (!cancelled) {
            setTranslations(data)
            setIsLoading(false)
          }
          return
        }

        // Fallback to direct file access
        const fileResponse = await fetch(`/locales/${locale}.json?t=${Date.now()}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        })
        
        if (fileResponse.ok) {
          const fileData = await fileResponse.json()
          if (!cancelled) {
            setTranslations(fileData)
            setIsLoading(false)
          }
          return
        }

        // Both failed - set empty translations
        if (!cancelled) {
          setTranslations({})
          setIsLoading(false)
        }
      } catch (error) {
        console.error(`[TranslationContext] Failed to load translations for ${locale}:`, error)
        if (!cancelled) {
          setTranslations({})
          setIsLoading(false)
        }
      }
    }

    loadTranslations()

    return () => {
      cancelled = true
    }
  }, [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale)
    }
  }, [])

  // Translation function with dot notation support
  const t = useCallback((key: string): string => {
    if (!translations || Object.keys(translations).length === 0) {
      return key
    }

    const keys = key.split('.')
    let value: unknown = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }, [translations])

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

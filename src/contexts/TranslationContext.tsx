'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

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
  // Get initial locale from props, URL, or default to 'sr'
  const getInitialLocale = (): Locale => {
    // Priority 1: initialLocale prop (most reliable)
    if (initialLocale && ['en', 'sr', 'fr', 'de'].includes(initialLocale)) {
      return initialLocale
    }
    // Priority 2: URL path
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/').filter(Boolean)
      const urlLocale = pathSegments[0] as Locale
      if (['en', 'sr', 'fr', 'de'].includes(urlLocale)) {
        return urlLocale
      }
    }
    // Priority 3: localStorage
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale
      if (savedLocale && ['en', 'sr', 'fr', 'de'].includes(savedLocale)) {
        return savedLocale
      }
    }
    // Default fallback
    return 'sr'
  }
  
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale())
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // CRITICAL: Sync locale with initialLocale prop IMMEDIATELY when it changes
  useEffect(() => {
    if (initialLocale && ['en', 'sr', 'fr', 'de'].includes(initialLocale)) {
      if (initialLocale !== locale) {
        console.log(`[TranslationContext] Setting locale from prop: ${initialLocale} (was: ${locale})`)
        setLocaleState(initialLocale)
        localStorage.setItem('locale', initialLocale)
      }
    }
    setIsInitialized(true)
  }, [initialLocale]) // Remove locale from deps to avoid loops

  // Load translations when locale changes
  useEffect(() => {
    if (!isInitialized) return

    const loadTranslations = async () => {
      console.log(`[TranslationContext] Loading translations for locale: ${locale}`)
      try {
        // Try loading from public/locales first (for client-side)
        const url = `/locales/${locale}.json`
        console.log(`[TranslationContext] Fetching from: ${url}`)
        let response = await fetch(url)
        if (!response.ok) {
          console.warn(`[TranslationContext] Failed to load from /locales/${locale}.json, trying API...`)
          // Fallback to src/locales via API if needed
          response = await fetch(`/api/translations?locale=${locale}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        }
        const data = await response.json()
        console.log(`[TranslationContext] Loaded translations for ${locale}:`, Object.keys(data))
        setTranslations(data)
      } catch (error) {
        console.error(`[TranslationContext] Failed to load translations for ${locale}:`, error)
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

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
  // Get initial locale - prioritize initialLocale prop above all else
  const getInitialLocale = (): Locale => {
    // Priority 1: initialLocale prop (most reliable - comes from URL)
    if (initialLocale && ['en', 'sr', 'fr', 'de'].includes(initialLocale)) {
      console.log(`[TranslationContext] Initializing with prop locale: ${initialLocale}`)
      return initialLocale
    }
    // Priority 2: URL path (fallback if prop not available)
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/').filter(Boolean)
      const urlLocale = pathSegments[0] as Locale
      if (['en', 'sr', 'fr', 'de'].includes(urlLocale)) {
        console.log(`[TranslationContext] Initializing with URL locale: ${urlLocale}`)
        return urlLocale
      }
    }
    // Priority 3: localStorage (fallback)
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale
      if (savedLocale && ['en', 'sr', 'fr', 'de'].includes(savedLocale)) {
        console.log(`[TranslationContext] Initializing with saved locale: ${savedLocale}`)
        return savedLocale
      }
    }
    // Default fallback
    console.log(`[TranslationContext] Initializing with default locale: sr`)
    return 'sr'
  }
  
  // Initialize with correct locale immediately
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale())
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // CRITICAL: Sync locale with initialLocale prop IMMEDIATELY when it changes
  useEffect(() => {
    if (initialLocale && ['en', 'sr', 'fr', 'de'].includes(initialLocale)) {
      if (initialLocale !== locale) {
        console.log(`[TranslationContext] Updating locale from prop: ${initialLocale} (was: ${locale})`)
        setLocaleState(initialLocale)
        localStorage.setItem('locale', initialLocale)
        // Clear translations to force reload with new locale
        setTranslations({})
      }
    }
    setIsInitialized(true)
  }, [initialLocale]) // Only depend on initialLocale, not locale

  // Load translations when locale changes
  useEffect(() => {
    if (!isInitialized) return

    const loadTranslations = async () => {
      console.log(`[TranslationContext] Loading translations for locale: ${locale}`)
      try {
        // Try loading from public/locales first (for client-side)
        const url = `/locales/${locale}.json?t=${Date.now()}` // Cache busting
        console.log(`[TranslationContext] Fetching from: ${url}`)
        let response = await fetch(url, {
          cache: 'no-store' // Prevent caching
        })
        if (!response.ok) {
          console.warn(`[TranslationContext] Failed to load from /locales/${locale}.json, trying API...`)
          // Fallback to src/locales via API if needed
          response = await fetch(`/api/translations?locale=${locale}`, {
            cache: 'no-store'
          })
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        }
        const data = await response.json()
        console.log(`[TranslationContext] Loaded translations for ${locale}:`, Object.keys(data))
        console.log(`[TranslationContext] pricelist.title =`, data?.pricelist?.title)
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
    // If translations haven't loaded yet, return key
    if (!translations || Object.keys(translations).length === 0) {
      console.warn(`[TranslationContext] No translations loaded yet for key: ${key}`)
      return key
    }

    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`[TranslationContext] Translation not found for key: ${key} (locale: ${locale}, available keys: ${Object.keys(translations).join(', ')})`)
        return key // Return key if translation not found
      }
    }

    const result = typeof value === 'string' ? value : key
    if (result === key && keys.length > 0) {
      console.warn(`[TranslationContext] Translation result is key itself for: ${key} (value type: ${typeof value})`)
    }
    return result
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

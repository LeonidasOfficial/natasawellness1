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
    console.log(`[TranslationContext] Effect running - initialLocale: ${initialLocale}, current locale: ${locale}`)
    if (initialLocale && ['en', 'sr', 'fr', 'de'].includes(initialLocale)) {
      if (initialLocale !== locale) {
        console.log(`[TranslationContext] 🔄 Updating locale from prop: ${initialLocale} (was: ${locale})`)
        setLocaleState(initialLocale)
        localStorage.setItem('locale', initialLocale)
        // Clear translations to force reload with new locale
        setTranslations({})
      } else {
        console.log(`[TranslationContext] ✅ Locale already matches: ${locale}`)
      }
    } else {
      console.warn(`[TranslationContext] ⚠️ Invalid initialLocale: ${initialLocale}`)
    }
    setIsInitialized(true)
  }, [initialLocale]) // Only depend on initialLocale, not locale

  // Load translations when locale changes
  useEffect(() => {
    if (!isInitialized) {
      console.log(`[TranslationContext] Not initialized yet, skipping translation load`)
      return
    }

    // Reset translations when locale changes to show loading state
    setTranslations({})

    const loadTranslations = async () => {
      console.log(`[TranslationContext] 🔄 Loading translations for locale: ${locale}`)
      try {
        // Try loading from public/locales first (for client-side)
        const url = `/locales/${locale}.json`
        console.log(`[TranslationContext] 📡 Fetching from: ${url}`)
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        })
        
        console.log(`[TranslationContext] 📥 Response status: ${response.status}, ok: ${response.ok}, headers:`, Object.fromEntries(response.headers.entries()))
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error(`[TranslationContext] ❌ Failed to load from /locales/${locale}.json:`, response.status, errorText)
          
          // Fallback to src/locales via API if needed
          console.log(`[TranslationContext] 🔄 Trying API fallback...`)
          const apiResponse = await fetch(`/api/translations?locale=${locale}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            },
            cache: 'no-store'
          })
          
          if (!apiResponse.ok) {
            const apiErrorText = await apiResponse.text()
            throw new Error(`API fallback also failed! Status: ${apiResponse.status}, Error: ${apiErrorText}`)
          }
          
          const apiData = await apiResponse.json()
          console.log(`[TranslationContext] ✅ Loaded translations via API for ${locale}:`, Object.keys(apiData).length, 'keys')
          setTranslations(apiData)
          return
        }
        
        const data = await response.json()
        console.log(`[TranslationContext] ✅ Loaded translations for ${locale}:`, Object.keys(data).length, 'keys')
        console.log(`[TranslationContext] Sample keys:`, Object.keys(data).slice(0, 5))
        console.log(`[TranslationContext] priceList exists:`, !!data?.priceList)
        console.log(`[TranslationContext] priceList.title =`, data?.priceList?.title)
        setTranslations(data)
      } catch (error) {
        console.error(`[TranslationContext] ❌ CRITICAL: Failed to load translations for ${locale}:`, error)
        console.error(`[TranslationContext] Error details:`, error instanceof Error ? error.message : String(error))
        // Don't set empty translations - keep trying or show error
        // setTranslations({})
      }
    }

    // Load immediately when locale or initialization changes
    loadTranslations()
  }, [locale, isInitialized])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  // Translation function with dot notation support
  const t = (key: string): string => {
    // If translations haven't loaded yet, return key (but don't spam console)
    if (!translations || Object.keys(translations).length === 0) {
      // Only log once per key to avoid console spam
      if (!(key in (window as any).__translationWarnings || {})) {
        (window as any).__translationWarnings = (window as any).__translationWarnings || {}
        ;(window as any).__translationWarnings[key] = true
        console.warn(`[TranslationContext] ⚠️ No translations loaded yet for key: ${key} (locale: ${locale}, initialized: ${isInitialized})`)
      }
      return key
    }

    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Only warn once per missing key
        const warningKey = `missing_${key}`
        if (!(warningKey in (window as any).__translationWarnings || {})) {
          (window as any).__translationWarnings = (window as any).__translationWarnings || {}
          ;(window as any).__translationWarnings[warningKey] = true
          console.warn(`[TranslationContext] Translation not found for key: ${key} (locale: ${locale}, available top-level keys: ${Object.keys(translations).join(', ')})`)
        }
        return key // Return key if translation not found
      }
    }

    const result = typeof value === 'string' ? value : key
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

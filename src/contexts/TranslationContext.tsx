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

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('sr')
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize locale from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Extract locale from URL path (e.g., /sr/about -> 'sr')
      const pathSegments = window.location.pathname.split('/').filter(Boolean)
      const urlLocale = pathSegments[0] as Locale
      
      if (['en', 'sr', 'fr', 'de'].includes(urlLocale)) {
        setLocaleState(urlLocale)
        localStorage.setItem('locale', urlLocale)
      } else {
        // Fall back to localStorage if URL doesn't have a valid locale
        const savedLocale = localStorage.getItem('locale') as Locale
        if (savedLocale && ['en', 'sr', 'fr', 'de'].includes(savedLocale)) {
          setLocaleState(savedLocale)
        } else {
          // Default to Serbian if no saved locale
          setLocaleState('sr')
          localStorage.setItem('locale', 'sr')
        }
      }
      setIsInitialized(true)
    }
  }, [])

  // Load translations when locale changes
  useEffect(() => {
    if (!isInitialized) return

    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}.json`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTranslations(data)
      } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error)
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

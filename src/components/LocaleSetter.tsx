'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from '@/contexts/TranslationContext'

export default function LocaleSetter() {
  const params = useParams()
  const { setLocale, locale: currentLocale } = useTranslation()
  
  useEffect(() => {
    const locale = params.locale as 'en' | 'sr' | 'fr' | 'de'
    if (locale && ['en', 'sr', 'fr', 'de'].includes(locale)) {
      // Only update if different to avoid unnecessary re-renders
      if (currentLocale !== locale) {
        setLocale(locale)
      }
    } else {
      // Default to Serbian if no valid locale in URL
      if (currentLocale !== 'sr') {
        setLocale('sr')
      }
    }
  }, [params.locale, setLocale, currentLocale])
  
  return null
}


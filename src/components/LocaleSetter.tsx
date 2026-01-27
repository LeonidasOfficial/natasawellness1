'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from '@/contexts/TranslationContext'

export default function LocaleSetter() {
  const params = useParams()
  const { setLocale } = useTranslation()
  
  useEffect(() => {
    const locale = params.locale as 'en' | 'sr' | 'fr' | 'de'
    if (locale && ['en', 'sr', 'fr', 'de'].includes(locale)) {
      setLocale(locale)
    }
  }, [params.locale, setLocale])
  
  return null
}


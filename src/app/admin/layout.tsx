'use client'

import { useEffect } from 'react'
import { useTranslation } from '@/contexts/TranslationContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { locale, setLocale } = useTranslation()

  // Force English for admin panel
  useEffect(() => {
    if (locale !== 'en') {
      setLocale('en')
    }
  }, [locale, setLocale])

  return <>{children}</>
}


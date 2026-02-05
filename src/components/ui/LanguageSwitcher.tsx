'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaGlobe } from 'react-icons/fa'
import { useTranslation } from '@/contexts/TranslationContext'

const locales = ['sr', 'en', 'fr', 'de'] as const
type Locale = (typeof locales)[number]

const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  sr: 'Српски'
}

const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  sr: '🇷🇸'
}

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const { locale: currentLocale } = useTranslation()

  // Strip locale prefix to get path without locale (e.g. /en/about -> /about)
  const pathWithoutLocale = pathname.replace(/^\/(en|sr|fr|de)/, '') || '/'

  return (
    <div className="relative z-50">
      <div className="flex items-center gap-2 mb-2">
        <FaGlobe className="text-primary text-lg flex-shrink-0" />
        <span className="font-semibold text-dark text-sm">Language</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {locales.map((locale) => {
          const isActive = currentLocale === locale
          const href = `/${locale}${pathWithoutLocale}`
          return (
            <Link
              key={locale}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-primary text-dark'
                  : 'bg-primary/10 text-dark hover:bg-primary/20'
              }`}
            >
              <span>{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

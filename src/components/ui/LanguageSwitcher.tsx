'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGlobe, FaCheck } from 'react-icons/fa'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from '@/contexts/TranslationContext'

const locales = ['en', 'sr', 'fr', 'de'] as const
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
  const [isOpen, setIsOpen] = useState(false)
  const { locale: currentLocale } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: Locale) => {
    setIsOpen(false)
    
    // Get the current path without the locale prefix
    const pathWithoutLocale = pathname.replace(/^\/(en|sr|fr|de)/, '') || '/'
    
    // Navigate to the new locale path
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <div className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors duration-300 border-2 border-primary/20 min-w-[140px] justify-center"
        aria-label="Change language"
      >
        <FaGlobe className="text-primary text-lg flex-shrink-0" />
        <span className="font-semibold text-dark whitespace-nowrap">
          {localeFlags[currentLocale]} {localeNames[currentLocale]}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-2xl shadow-2xl border-2 border-primary/10 overflow-hidden z-[60]"
            >
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={`w-full px-6 py-4 flex items-center justify-between hover:bg-primary/10 transition-colors duration-200 ${
                    currentLocale === locale ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{localeFlags[locale]}</span>
                    <span className="font-semibold text-dark">
                      {localeNames[locale]}
                    </span>
                  </div>
                  {currentLocale === locale && (
                    <FaCheck className="text-primary" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

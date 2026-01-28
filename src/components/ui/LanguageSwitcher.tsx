'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { locale: currentLocale } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        left: Math.max(16, rect.left - 40), // Ensure some padding from edge
        width: Math.max(224, rect.width + 80)
      })
    }
  }, [isOpen])

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
        ref={buttonRef}
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
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown - Fixed position to avoid overflow clipping */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'fixed',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxWidth: 'calc(100vw - 32px)'
              }}
              className="bg-white rounded-2xl shadow-2xl border-2 border-primary/10 overflow-hidden z-[9999]"
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

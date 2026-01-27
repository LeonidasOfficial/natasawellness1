'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGlobe, FaCheck } from 'react-icons/fa'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/request'
import { useTranslation } from '@/contexts/TranslationContext'
import { usePathname, useRouter } from 'next/navigation'

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { locale: currentLocale, setLocale } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
    
    // Update URL to new locale
    const pathWithoutLocale = pathname.replace(/^\/(en|fr|de|sr)/, '') || '/'
    const newPath = `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors duration-300 border-2 border-primary/20"
      >
        <FaGlobe className="text-primary text-lg" />
        <span className="font-semibold text-dark">
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
              className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-2xl shadow-2xl border-2 border-primary/10 overflow-hidden z-50"
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

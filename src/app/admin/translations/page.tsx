'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaGlobe, FaSave, FaSync, FaCheck, FaTimes } from 'react-icons/fa'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

interface Translation {
  key: string
  en: string
  sr?: string
  fr?: string
  de?: string
}

export default function TranslationsManagement() {
  const [translations, setTranslations] = useState<Translation[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<'sr' | 'fr' | 'de'>('sr')

  useEffect(() => {
    loadTranslations()
  }, [])

  const loadTranslations = async () => {
    try {
      setLoading(true)
      const fetchLocale = async (locale: string) => {
        const res = await fetch(`/api/translations?locale=${locale}`, { cache: 'no-store' })
        if (res.ok) return res.json()
        const fallback = await fetch(`/locales/${locale}.json`)
        return fallback.json()
      }

      const [enData, srData, frData, deData] = await Promise.all([
        fetchLocale('en'),
        fetchLocale('sr'),
        fetchLocale('fr'),
        fetchLocale('de'),
      ])

      // Flatten nested objects into key-value pairs
      const flattenObject = (obj: any, prefix = ''): Translation[] => {
        const result: Translation[] = []
        
        for (const key in obj) {
          const fullKey = prefix ? `${prefix}.${key}` : key
          
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            result.push(...flattenObject(obj[key], fullKey))
          } else {
            result.push({
              key: fullKey,
              en: getValue(enData, fullKey),
              sr: getValue(srData, fullKey),
              fr: getValue(frData, fullKey),
              de: getValue(deData, fullKey),
            })
          }
        }
        
        return result
      }

      const getValue = (obj: any, path: string): string => {
        return path.split('.').reduce((acc, part) => acc?.[part], obj) || ''
      }

      const allTranslations = flattenObject(enData)
      setTranslations(allTranslations)
    } catch (error) {
      console.error('Failed to load translations:', error)
      toast.error('Failed to load translations')
    } finally {
      setLoading(false)
    }
  }

  const handleTranslationChange = (key: string, language: 'sr' | 'fr' | 'de', value: string) => {
    setTranslations(prev =>
      prev.map(t => (t.key === key ? { ...t, [language]: value } : t))
    )
  }

  const saveTranslations = async () => {
    try {
      setSaving(true)
      
      // Convert flat translations back to nested structure
      const unflattenObject = (translations: Translation[], language: 'sr' | 'fr' | 'de') => {
        const result: any = {}
        
        translations.forEach(t => {
          const keys = t.key.split('.')
          let current = result
          
          keys.forEach((key, index) => {
            if (index === keys.length - 1) {
              current[key] = t[language] || t.en
            } else {
              current[key] = current[key] || {}
              current = current[key]
            }
          })
        })
        
        return result
      }

      const srData = unflattenObject(translations, 'sr')
      const frData = unflattenObject(translations, 'fr')
      const deData = unflattenObject(translations, 'de')

      // Save to files (this would need a backend API endpoint in production)
      await Promise.all([
        fetch('/api/translations/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale: 'sr', data: srData }),
        }),
        fetch('/api/translations/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale: 'fr', data: frData }),
        }),
        fetch('/api/translations/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale: 'de', data: deData }),
        }),
      ])

      toast.success('✅ Translations saved successfully!')
    } catch (error) {
      console.error('Failed to save translations:', error)
      toast.error('Failed to save translations')
    } finally {
      setSaving(false)
    }
  }

  const autoTranslate = async (key: string, language: 'sr' | 'fr' | 'de') => {
    const translation = translations.find(t => t.key === key)
    if (!translation) return

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: translation.en,
          targetLang: language,
        }),
      })

      const data = await response.json()
      
      if (data.translatedText) {
        handleTranslationChange(key, language, data.translatedText)
        toast.success(`✅ Translated to ${language.toUpperCase()} - Saved to project files!`)
      }
    } catch (error) {
      console.error('Translation failed:', error)
      toast.error('Auto-translation failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaGlobe className="text-6xl text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading translations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <FaArrowLeft className="text-dark" />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-dark font-playfair">Translation Management</h1>
                <p className="text-gray-600 mt-2">Manage multilingual content for your website</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveTranslations}
              disabled={saving}
              className="px-6 py-3 bg-primary text-dark font-semibold rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave /> {saving ? 'Saving...' : 'Save All Changes'}
            </motion.button>
          </div>

          {/* Language Selector */}
          <div className="flex gap-4">
            {[
              { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
              { code: 'fr', name: 'French', flag: '🇫🇷' },
              { code: 'de', name: 'German', flag: '🇩🇪' },
            ].map(lang => (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLanguage(lang.code as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedLanguage === lang.code
                    ? 'bg-primary text-dark shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lang.flag} {lang.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Translations Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Key</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">English (Source)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Translation ({selectedLanguage.toUpperCase()})
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {translations.map((translation, index) => (
                  <tr key={translation.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{translation.key}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{translation.en}</td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={translation[selectedLanguage] || ''}
                        onChange={(e) =>
                          handleTranslationChange(translation.key, selectedLanguage, e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                        placeholder={`Enter ${selectedLanguage.toUpperCase()} translation...`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => autoTranslate(translation.key, selectedLanguage)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Auto-translate"
                        >
                          <FaSync className="text-sm" />
                        </motion.button>
                        
                        {translation[selectedLanguage] && (
                          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <FaCheck className="text-sm" />
                          </div>
                        )}
                        
                        {!translation[selectedLanguage] && (
                          <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <FaTimes className="text-sm" />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <FaGlobe /> Translation Tips
          </h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Click the sync icon to auto-translate using AI</li>
            <li>• Green checkmark indicates translation exists</li>
            <li>• Red cross indicates missing translation (will fallback to English)</li>
            <li>• Remember to click "Save All Changes" when done</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'fr', 'de', 'sr'] as const
export type Locale = (typeof locales)[number]

export const localeNames = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  sr: 'Српски'
}

export const localeFlags = {
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  sr: '🇷🇸'
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound()

  const validLocale = locale as Locale

  return {
    locale: validLocale,
    messages: (await import(`../locales/${validLocale}.json`)).default
  }
})

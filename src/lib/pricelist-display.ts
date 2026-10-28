/**
 * Helpers that decide what text the PUBLIC site shows for price-list
 * categories and treatments.
 *
 * Rules:
 * - Serbian ('sr', the default locale) always shows the text saved in the
 *   admin panel when it is non-empty. Translations never override it.
 * - Other locales use a translation only when it is keyed to that specific
 *   category/treatment. Icon-keyed category translations
 *   (`priceList.cat.<icon>` / `priceList.catDesc.<icon>`) are only used for
 *   the original seeded categories (ids 1-11 with their original icon).
 *   Anything else (e.g. a category added in the admin panel) falls back to
 *   the saved text.
 *
 * This module is pure and safe to import from client and server code.
 */
import { pricelistTreatmentTranslations } from '@/data/pricelist-translations'

export interface PriceListTreatment {
  id: string
  name: string
  description: string
  price: number
  price2?: number
  duration: string
  note?: string
}

export interface PriceListCategory {
  id: string
  category: string
  icon: string
  description: string
  treatments: PriceListTreatment[]
  footnote?: string
}

type TFn = (key: string) => string

export const DEFAULT_LOCALE = 'sr'

/** Original seeded categories (src/data/price-list.json): id -> icon. */
export const SEEDED_CATEGORY_ICONS: Record<string, string> = {
  '1': 'face',
  '2': 'hair-removal',
  '3': 'pedikir',
  '4': 'pedikir-gl',
  '5': 'manikir',
  '6': 'manikir-gl',
  '7': 'manikir-gel',
  '8': 'eyes',
  '9': 'wellness',
  '10': 'makeup',
  '11': 'tan',
}

/** Category images used on the public site (by icon). */
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  face: '/img/facials.png',
  'hair-removal': '/img/waxing.png',
  pedikir: '/img/pedicure.png',
  'pedikir-gl': '/img/pedicure.png',
  manikir: '/img/manicure.png',
  'manikir-gl': '/img/manicure.png',
  'manikir-gel': '/img/manicure.png',
  eyes: '/img/eyelashes.png',
  wellness: '/img/massage.png',
  massage: '/img/massage.png',
  makeup: '/img/makeup.png',
  tan: '/img/spraytan.png',
  nails: '/img/manicure.png',
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/** Returns the translation for `key`, or null when it is missing/empty. */
function lookup(t: TFn, key: string): string | null {
  const value = t(key)
  return hasText(value) && value !== key ? value : null
}

function isDefaultLocale(locale: string | undefined): boolean {
  return !locale || locale === DEFAULT_LOCALE
}

function isSeededCategory(category: PriceListCategory): boolean {
  return SEEDED_CATEGORY_ICONS[String(category.id)] === category.icon
}

export function getCategoryName(category: PriceListCategory, locale: string, t: TFn): string {
  if (isDefaultLocale(locale)) {
    if (hasText(category.category)) return category.category
  } else if (isSeededCategory(category)) {
    const translated = lookup(t, `priceList.cat.${category.icon}`)
    if (translated) return translated
  }
  return category.category || ''
}

export function getCategoryDesc(category: PriceListCategory, locale: string, t: TFn): string {
  if (isDefaultLocale(locale)) {
    if (hasText(category.description)) return category.description
  } else if (isSeededCategory(category)) {
    const translated = lookup(t, `priceList.catDesc.${category.icon}`)
    if (translated) return translated
  }
  return category.description || ''
}

export function getTreatmentName(treatment: PriceListTreatment, locale: string, t: TFn): string {
  if (isDefaultLocale(locale)) {
    if (hasText(treatment.name)) return treatment.name
  } else {
    const byId = pricelistTreatmentTranslations[treatment.id]
    const fromTable = byId?.[locale as keyof typeof byId]
    if (hasText(fromTable)) return fromTable
    const translated = lookup(t, `priceList.trt.${treatment.id}`)
    if (translated) return translated
  }
  return treatment.name || ''
}

export function getTreatmentDesc(treatment: PriceListTreatment, locale: string, t: TFn): string {
  if (!hasText(treatment.description)) return ''
  if (!isDefaultLocale(locale)) {
    const translated = lookup(t, `priceList.trtDesc.${treatment.id}`)
    if (translated) return translated
  }
  return treatment.description
}

export function getFootnote(category: PriceListCategory, locale: string, t: TFn): string {
  if (!hasText(category.footnote)) return ''
  if (!isDefaultLocale(locale)) {
    const translated = lookup(t, `priceList.fn.${category.id}`)
    if (translated) return translated
  }
  return category.footnote
}

export function getCategoryImage(category: PriceListCategory): string | undefined {
  return CATEGORY_IMAGE_MAP[category.icon]
}

/** True when `data` looks like a usable, non-empty price list. */
export function isPriceList(data: unknown): data is PriceListCategory[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (c) => c && typeof c === 'object' && 'id' in c && Array.isArray((c as PriceListCategory).treatments)
    )
  )
}

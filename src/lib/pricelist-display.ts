/**
 * Helpers that decide what text the PUBLIC site shows for price-list
 * categories and treatments.
 *
 * Rules:
 * - Serbian ('sr', the default locale) always shows the text saved in the
 *   admin panel when it is non-empty. Translations never override it.
 * - Other locales (en/fr/de) use, in order:
 *   1. the per-language text saved with the item in the admin panel
 *      (`translations.<locale>`),
 *   2. the code translation map (src/data/pricelist-content-translations.ts),
 *      keyed by the item's id, but ONLY while the item's current Serbian text
 *      still matches the text that translation was made from,
 *   3. legacy translations (translation table by treatment id, icon-keyed
 *      category texts, footnotes by id) under the same "Serbian text
 *      unchanged" condition,
 *   4. otherwise the saved Serbian text (never a stale translation).
 *
 * This module is pure and safe to import from client and server code.
 */
import { pricelistTreatmentTranslations } from '@/data/pricelist-translations'
import {
  categoryContentTranslations,
  treatmentContentTranslations,
  type CategoryTextFields,
  type TreatmentTextFields,
  type TranslatedLocale,
} from '@/data/pricelist-content-translations'
import seededPriceList from '@/data/price-list.json'

export type { CategoryTextFields, TreatmentTextFields, TranslatedLocale }

export const TRANSLATED_LOCALES: TranslatedLocale[] = ['en', 'fr', 'de']

export interface PriceListTreatment {
  id: string
  name: string
  description: string
  price: number
  price2?: number
  duration: string
  note?: string
  /** Optional per-language texts saved from the admin panel. */
  translations?: Partial<Record<TranslatedLocale, TreatmentTextFields>>
}

export interface PriceListCategory {
  id: string
  category: string
  icon: string
  description: string
  treatments: PriceListTreatment[]
  footnote?: string
  /** Optional per-language texts saved from the admin panel. */
  translations?: Partial<Record<TranslatedLocale, CategoryTextFields>>
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
  men: '/img/men.webp',
}

/**
 * Per-category image overrides (by category id). Only applied while the
 * category still has the admin's default icon ('face'); as soon as the owner
 * picks another icon in the admin panel, the icon's image is used instead.
 */
const CATEGORY_IMAGE_OVERRIDES: Record<string, { whenIcon: string; image: string }> = {
  // "Muški Tretmani" — created in the admin panel with the default icon.
  '1793107963810': { whenIcon: 'face', image: '/img/men.webp' },
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/** Normalise text for "is the Serbian source unchanged?" comparisons. */
function norm(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().toLowerCase() : ''
}

function sameSource(current: unknown, source: unknown): boolean {
  return norm(current) === norm(source)
}

/** Returns the translation for `key`, or null when it is missing/empty. */
function lookup(t: TFn, key: string): string | null {
  const value = t(key)
  return hasText(value) && value !== key ? value : null
}

function isDefaultLocale(locale: string | undefined): boolean {
  return !locale || locale === DEFAULT_LOCALE
}

function asTranslatedLocale(locale: string): TranslatedLocale | null {
  return (TRANSLATED_LOCALES as string[]).includes(locale) ? (locale as TranslatedLocale) : null
}

type SeededCategory = { id: string; category?: string; description?: string; footnote?: string; icon?: string }
const seededCategories = new Map<string, SeededCategory>(
  ((Array.isArray(seededPriceList) ? seededPriceList : []) as SeededCategory[]).map(
    (c): [string, SeededCategory] => [String(c.id), c]
  )
)

/** Original seeded category whose icon and given field are unchanged. */
function seededFieldUnchanged(
  category: PriceListCategory,
  field: 'category' | 'description' | 'footnote'
): boolean {
  const seeded = seededCategories.get(String(category.id))
  if (!seeded || SEEDED_CATEGORY_ICONS[String(category.id)] !== category.icon) return false
  return sameSource(category[field], seeded[field])
}

function categoryText(
  category: PriceListCategory,
  field: 'category' | 'description' | 'footnote',
  locale: string,
  t: TFn,
  legacyKey: string | null
): string {
  const saved = category[field] || ''
  if (isDefaultLocale(locale)) return saved
  const loc = asTranslatedLocale(locale)
  if (!loc) return saved

  // 1. Saved with the item from the admin panel
  const own = category.translations?.[loc]?.[field]
  if (hasText(own)) return own

  // 2. Code map keyed by id, only while the Serbian source is unchanged
  const entry = categoryContentTranslations[String(category.id)]
  const mapped = entry?.[loc]?.[field]
  if (entry && hasText(mapped) && sameSource(saved, entry.sr[field])) return mapped

  // 3. Legacy locale-file translations for the original seeded categories
  if (legacyKey && seededFieldUnchanged(category, field)) {
    const legacy = lookup(t, legacyKey)
    if (legacy) return legacy
  }

  // 4. Saved (Serbian) text
  return saved
}

function treatmentText(
  treatment: PriceListTreatment,
  field: 'name' | 'description',
  locale: string,
  t: TFn
): string {
  const saved = treatment[field] || ''
  if (isDefaultLocale(locale)) return saved
  const loc = asTranslatedLocale(locale)
  if (!loc) return saved

  const own = treatment.translations?.[loc]?.[field]
  if (hasText(own)) return own

  const entry = treatmentContentTranslations[String(treatment.id)]
  const mapped = entry?.[loc]?.[field]
  if (entry && hasText(mapped) && sameSource(saved, entry.sr[field])) return mapped

  if (field === 'name') {
    const legacy = pricelistTreatmentTranslations[treatment.id]
    if (legacy && hasText(legacy[loc]) && sameSource(saved, legacy.sr)) return legacy[loc]
  }

  return saved
}

export function getCategoryName(category: PriceListCategory, locale: string, t: TFn): string {
  return categoryText(category, 'category', locale, t, `priceList.cat.${category.icon}`)
}

export function getCategoryDesc(category: PriceListCategory, locale: string, t: TFn): string {
  return categoryText(category, 'description', locale, t, `priceList.catDesc.${category.icon}`)
}

export function getTreatmentName(treatment: PriceListTreatment, locale: string, t: TFn): string {
  return treatmentText(treatment, 'name', locale, t)
}

export function getTreatmentDesc(treatment: PriceListTreatment, locale: string, t: TFn): string {
  if (!hasText(treatment.description)) return ''
  return treatmentText(treatment, 'description', locale, t)
}

export function getFootnote(category: PriceListCategory, locale: string, t: TFn): string {
  if (!hasText(category.footnote)) return ''
  return categoryText(category, 'footnote', locale, t, `priceList.fn.${category.id}`)
}

/**
 * The automatic (code-map) translation for a field, if one exists and still
 * matches the given Serbian text. Used by the admin panel as a hint.
 */
export function getAutomaticTranslation(
  kind: 'category' | 'treatment',
  id: string,
  field: 'category' | 'description' | 'footnote' | 'name',
  locale: TranslatedLocale,
  currentSerbian: string
): string {
  const entry =
    kind === 'category'
      ? (categoryContentTranslations[id] as unknown as Record<string, Record<string, string | undefined>> | undefined)
      : (treatmentContentTranslations[id] as unknown as Record<string, Record<string, string | undefined>> | undefined)
  const value = entry?.[locale]?.[field]
  return entry && hasText(value) && sameSource(currentSerbian, entry.sr?.[field]) ? value : ''
}

export function getCategoryImage(category: PriceListCategory): string | undefined {
  const override = CATEGORY_IMAGE_OVERRIDES[String(category.id)]
  if (override && override.whenIcon === category.icon) return override.image
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

/**
 * Server-side sanitiser for per-language texts sent by the admin panel:
 * keeps only en/fr/de string fields (trimmed, non-empty). Returns undefined
 * when nothing is left.
 */
export function sanitizeItemTranslations(
  input: unknown,
  allowedFields: string[]
): Partial<Record<TranslatedLocale, Record<string, string>>> | undefined {
  if (!input || typeof input !== 'object') return undefined
  const out: Partial<Record<TranslatedLocale, Record<string, string>>> = {}
  for (const locale of TRANSLATED_LOCALES) {
    const fields = (input as Record<string, unknown>)[locale]
    if (!fields || typeof fields !== 'object') continue
    const kept: Record<string, string> = {}
    for (const field of allowedFields) {
      const v = (fields as Record<string, unknown>)[field]
      if (typeof v === 'string' && v.trim()) kept[field] = v.trim()
    }
    if (Object.keys(kept).length) out[locale] = kept
  }
  return Object.keys(out).length ? out : undefined
}

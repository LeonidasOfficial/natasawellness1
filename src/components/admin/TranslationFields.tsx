'use client'

import type { TranslatedLocale } from '@/lib/pricelist-display'

const LOCALE_LABELS: Record<TranslatedLocale, string> = {
  en: 'English (EN)',
  fr: 'Français (FR)',
  de: 'Deutsch (DE)',
}

export type TranslationValues = Partial<Record<TranslatedLocale, Record<string, string | undefined>>>

interface FieldDef {
  key: string
  label: string
  multiline?: boolean
}

interface TranslationFieldsProps {
  fields: FieldDef[]
  value: TranslationValues
  onChange: (value: TranslationValues) => void
  /** Automatic translation currently used on the site (shown as placeholder). */
  automatic?: (locale: TranslatedLocale, field: string) => string
  /** True when the Serbian text was changed while saved translations exist. */
  serbianChanged?: boolean
}

/**
 * Optional per-language texts for a price-list item. Saved together with the
 * item; when a field is left empty the public site uses the automatic
 * translation (if it still matches the Serbian text) or the Serbian text.
 */
export default function TranslationFields({
  fields,
  value,
  onChange,
  automatic,
  serbianChanged,
}: TranslationFieldsProps) {
  const locales: TranslatedLocale[] = ['en', 'fr', 'de']
  const hasSaved = locales.some((l) => fields.some((f) => (value[l]?.[f.key] || '').trim()))

  const update = (locale: TranslatedLocale, field: string, text: string) => {
    onChange({ ...value, [locale]: { ...(value[locale] || {}), [field]: text } })
  }

  return (
    <details className="border-2 border-gray-200 rounded-lg p-3" open={serbianChanged && hasSaved}>
      <summary className="cursor-pointer text-sm font-semibold text-dark select-none">
        Prevodi (EN / FR / DE) – opciono
      </summary>
      <p className="text-xs text-gray-500 mt-2">
        Ostavite prazno da sajt koristi automatski prevod (prikazan sivo, ako postoji) ili srpski tekst.
      </p>
      {serbianChanged && hasSaved && (
        <p className="text-xs font-semibold text-amber-700 bg-amber-50 rounded p-2 mt-2">
          Promenili ste srpski tekst – proverite i ažurirajte sačuvane prevode ispod.
        </p>
      )}
      <div className="space-y-4 mt-3">
        {locales.map((locale) => (
          <div key={locale} className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">{LOCALE_LABELS[locale]}</div>
            {fields.map((field) => {
              const auto = automatic?.(locale, field.key) || ''
              const common = {
                value: value[locale]?.[field.key] || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  update(locale, field.key, e.target.value),
                placeholder: auto ? auto : `${field.label} (${locale.toUpperCase()})`,
                className:
                  'w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none',
                'aria-label': `${field.label} ${locale.toUpperCase()}`,
              }
              return field.multiline ? (
                <textarea key={field.key} rows={2} {...common} />
              ) : (
                <input key={field.key} type="text" {...common} />
              )
            })}
          </div>
        ))}
      </div>
    </details>
  )
}

/** Drop empty strings/locales so stored data stays clean. */
export function cleanTranslations(value: TranslationValues): TranslationValues | undefined {
  const out: TranslationValues = {}
  for (const locale of ['en', 'fr', 'de'] as TranslatedLocale[]) {
    const fields = value[locale]
    if (!fields) continue
    const kept: Record<string, string> = {}
    for (const [k, v] of Object.entries(fields)) {
      if (typeof v === 'string' && v.trim()) kept[k] = v.trim()
    }
    if (Object.keys(kept).length) out[locale] = kept
  }
  return Object.keys(out).length ? out : undefined
}

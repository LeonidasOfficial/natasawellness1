import { NextRequest, NextResponse } from 'next/server'
import { readContent } from '@/lib/content-store'
import srBundled from '../../../../public/locales/sr.json'
import enBundled from '../../../../public/locales/en.json'
import frBundled from '../../../../public/locales/fr.json'
import deBundled from '../../../../public/locales/de.json'

type Dict = Record<string, unknown>

// Translations shipped with the code. Stored (admin-edited) translations win,
// but any key missing from the stored copy falls back to these, so new UI
// texts added in code are translated even before the admin re-saves.
const BUNDLED: Record<string, Dict> = {
  sr: srBundled as Dict,
  en: enBundled as Dict,
  fr: frBundled as Dict,
  de: deBundled as Dict,
}

function isPlainObject(value: unknown): value is Dict {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function mergeWithDefaults(defaults: Dict, stored: Dict): Dict {
  const out: Dict = { ...defaults }
  for (const [key, value] of Object.entries(stored)) {
    const base = out[key]
    if (isPlainObject(base) && isPlainObject(value)) {
      out[key] = mergeWithDefaults(base, value)
    } else if (value !== undefined && value !== null && value !== '') {
      out[key] = value
    }
  }
  return out
}

export const dynamic = 'force-dynamic'

// GET - Get translations for a specific locale
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')

    if (!locale) {
      return NextResponse.json(
        { error: 'Locale parameter is required' },
        { status: 400 }
      )
    }

    const validLocales = ['en', 'sr', 'fr', 'de']
    if (!validLocales.includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale' },
        { status: 400 }
      )
    }

    const stored = await readContent<Dict>(`translations:${locale}`)
    const bundled = BUNDLED[locale]
    const translations = isPlainObject(stored) ? mergeWithDefaults(bundled, stored) : bundled
    if (!translations) {
      return NextResponse.json(
        { error: `Translation file not found for locale: ${locale}` },
        { status: 404 }
      )
    }

    return NextResponse.json(translations, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('[API] Error loading translations:', error)
    return NextResponse.json(
      { error: 'Failed to load translations', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

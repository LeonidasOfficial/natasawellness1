import { NextRequest, NextResponse } from 'next/server'
import { readContent } from '@/lib/content-store'

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

    const translations = await readContent(`translations:${locale}`)
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

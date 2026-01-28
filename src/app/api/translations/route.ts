import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

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

    // Validate locale
    const validLocales = ['en', 'sr', 'fr', 'de']
    if (!validLocales.includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale' },
        { status: 400 }
      )
    }

    // Try to load from public/locales first (preferred)
    let translations
    try {
      const publicPath = join(process.cwd(), 'public', 'locales', `${locale}.json`)
      const fileContent = await readFile(publicPath, 'utf-8')
      translations = JSON.parse(fileContent)
      console.log(`[API] Loaded translations from public/locales/${locale}.json`)
    } catch (publicError) {
      // Fallback to src/locales
      try {
        const srcPath = join(process.cwd(), 'src', 'locales', `${locale}.json`)
        const fileContent = await readFile(srcPath, 'utf-8')
        translations = JSON.parse(fileContent)
        console.log(`[API] Loaded translations from src/locales/${locale}.json`)
      } catch (srcError) {
        console.error(`[API] Failed to load translations for ${locale}:`, publicError, srcError)
        return NextResponse.json(
          { error: `Translation file not found for locale: ${locale}` },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(translations, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('[API] Error loading translations:', error)
    return NextResponse.json(
      { error: 'Failed to load translations', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { writeContent } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { locale, data } = await request.json()

    if (!locale || !data) {
      return NextResponse.json(
        { error: 'Locale and data are required' },
        { status: 400 }
      )
    }

    const validLocales = ['sr', 'fr', 'de', 'en']
    if (!validLocales.includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale' },
        { status: 400 }
      )
    }

    await writeContent(`translations:${locale}`, data)

    return NextResponse.json({
      success: true,
      message: `${locale} translations saved successfully`,
    })
  } catch (error) {
    console.error('Error saving translations:', error)
    return NextResponse.json(
      { error: 'Failed to save translations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

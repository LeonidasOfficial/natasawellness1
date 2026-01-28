import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { writeFile, mkdir, access } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Verify admin authentication
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

    // Validate locale
    const validLocales = ['sr', 'fr', 'de', 'en']
    if (!validLocales.includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale' },
        { status: 400 }
      )
    }

    // Save to public/locales directory (where the app reads from)
    const localesDir = join(process.cwd(), 'public', 'locales')
    
    // Ensure directory exists
    try {
      await access(localesDir)
    } catch {
      await mkdir(localesDir, { recursive: true })
    }

    // Save to public/locales (for browser access)
    const publicFilePath = join(localesDir, `${locale}.json`)
    await writeFile(publicFilePath, JSON.stringify(data, null, 2), 'utf-8')

    // Also save to src/locales (for server-side access)
    const srcLocalesDir = join(process.cwd(), 'src', 'locales')
    try {
      await access(srcLocalesDir)
    } catch {
      await mkdir(srcLocalesDir, { recursive: true })
    }
    const srcFilePath = join(srcLocalesDir, `${locale}.json`)
    await writeFile(srcFilePath, JSON.stringify(data, null, 2), 'utf-8')

    console.log(`✅ Translations saved to: ${publicFilePath}`)
    console.log(`✅ Translations saved to: ${srcFilePath}`)
    console.log(`📁 Changes persisted to project files`)

    return NextResponse.json({
      success: true,
      message: `${locale} translations saved successfully to project files`,
      savedToProject: true,
      publicPath: publicFilePath,
      srcPath: srcFilePath
    })
  } catch (error) {
    console.error('Error saving translations:', error)
    return NextResponse.json(
      { error: 'Failed to save translations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}


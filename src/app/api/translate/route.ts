import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Simple translation function using OpenAI
async function translateText(text: string, targetLang: string): Promise<string> {
  // Check if OpenAI API key is available
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    console.warn('OpenAI API key not found, returning original text')
    return text
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text to ${targetLang === 'sr' ? 'Serbian (Cyrillic)' : targetLang === 'fr' ? 'French' : 'German'}. Only return the translation, nothing else. Maintain any HTML tags or formatting.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

// POST - Auto-translate content
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { text, targetLanguages } = await request.json()

    if (!text || !targetLanguages || !Array.isArray(targetLanguages)) {
      return NextResponse.json(
        { error: 'Text and target languages are required' },
        { status: 400 }
      )
    }

    // Translate to all target languages
    const translations: { [key: string]: string } = { en: text }

    for (const lang of targetLanguages) {
      if (lang !== 'en') {
        translations[lang] = await translateText(text, lang)
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    return NextResponse.json({
      success: true,
      translations
    })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}

// GET - Get all translations for a specific content type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('type')
    const contentId = searchParams.get('id')

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type is required' },
        { status: 400 }
      )
    }

    // In a real implementation, you would fetch from database
    // For now, return empty translations
    return NextResponse.json({
      translations: {
        en: {},
        fr: {},
        de: {},
        sr: {}
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/content-store'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const PROMOTIONS_KEY = 'promotions'

// GET - Fetch promotions data
export async function GET() {
  try {
    const promotions = await readContent(PROMOTIONS_KEY)
    if (!promotions) {
      return NextResponse.json(
        { error: 'Promotions not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(promotions)
  } catch (error) {
    console.error('Failed to fetch promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

// PUT - Update promotions data
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    await writeContent(PROMOTIONS_KEY, body)

    return NextResponse.json({
      success: true,
      message: 'Promotions saved successfully',
    })
  } catch (error) {
    console.error('Error saving promotions:', error)
    return NextResponse.json(
      { error: 'Failed to save promotions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

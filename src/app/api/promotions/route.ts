import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Fetch promotions data
export async function GET() {
  try {
    const promotions = await readData('promotions')
    return NextResponse.json(promotions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

// PUT - Update promotions data
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    await writeData('promotions', body)

    console.log('✅ Promotions saved to: src/data/promotions.json')
    console.log('📁 Changes persisted to project files')

    return NextResponse.json({
      success: true,
      message: 'Promotions saved successfully to project files',
      savedToProject: true
    })
  } catch (error) {
    console.error('Error saving promotions:', error)
    return NextResponse.json(
      { error: 'Failed to save promotions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

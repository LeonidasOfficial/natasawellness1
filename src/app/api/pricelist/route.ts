import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

// GET - Fetch all price list categories and treatments
export async function GET() {
  try {
    const priceList = await readData('price-list')
    return NextResponse.json(priceList)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch price list' },
      { status: 500 }
    )
  }
}

// POST - Add new category or treatment
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

    const body = await request.json()
    const { type, categoryId, data } = body

    const priceList = await readData('price-list')

    if (type === 'category') {
      // Add new category
      const newCategory = {
        id: Date.now().toString(),
        category: data.category,
        icon: data.icon || 'face',
        description: data.description || '',
        treatments: [],
        footnote: data.footnote || undefined
      }
      priceList.push(newCategory)
    } else if (type === 'treatment') {
      // Add new treatment to existing category
      const category = priceList.find((cat: any) => cat.id === categoryId)
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      const newTreatment = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description || '',
        price: data.price,
        price2: data.price2 || undefined,
        duration: data.duration,
        note: data.note || ''
      }
      category.treatments.push(newTreatment)
    }

    await writeData('price-list', priceList)

    return NextResponse.json({ success: true, data: priceList })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add item' },
      { status: 500 }
    )
  }
}

// PUT - Update entire price list (for reordering or bulk updates)
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
    await writeData('price-list', body)

    return NextResponse.json({ success: true, data: body })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update price list' },
      { status: 500 }
    )
  }
}

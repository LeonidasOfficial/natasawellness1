import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface Treatment {
  id: string
  name: string
  description: string
  price: number
  price2?: number
  duration: string
  note?: string
}

interface Category {
  id: string
  category: string
  icon: string
  description: string
  treatments: Treatment[]
  footnote?: string
}

type PriceList = Category[]

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

    const priceList = await readData('price-list') as PriceList

    if (type === 'category') {
      // Add new category
      const newCategory: Category = {
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
      const category = priceList.find((cat: Category) => cat.id === categoryId)
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      const newTreatment: Treatment = {
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

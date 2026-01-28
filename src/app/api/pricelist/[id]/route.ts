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

// PUT - Update specific category or treatment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { type, categoryId, data } = body

    const priceList = await readData('price-list') as PriceList

    if (type === 'category') {
      // Update category
      const categoryIndex = priceList.findIndex((cat: Category) => cat.id === id)
      if (categoryIndex === -1) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      priceList[categoryIndex] = {
        ...priceList[categoryIndex],
        ...data
      }
    } else if (type === 'treatment') {
      // Update treatment
      const category = priceList.find((cat: Category) => cat.id === categoryId)
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      const treatmentIndex = category.treatments.findIndex(
        (treatment: Treatment) => treatment.id === id
      )
      if (treatmentIndex === -1) {
        return NextResponse.json(
          { error: 'Treatment not found' },
          { status: 404 }
        )
      }

      category.treatments[treatmentIndex] = {
        ...category.treatments[treatmentIndex],
        ...data
      }
    }

    await writeData('price-list', priceList)

    return NextResponse.json({ success: true, data: priceList })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

// DELETE - Delete specific category or treatment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const categoryId = searchParams.get('categoryId')

    const priceList = await readData('price-list') as PriceList

    if (type === 'category') {
      // Delete entire category
      const newPriceList = priceList.filter((cat: Category) => cat.id !== id)
      await writeData('price-list', newPriceList)
    } else if (type === 'treatment' && categoryId) {
      // Delete specific treatment
      const category = priceList.find((cat: Category) => cat.id === categoryId)
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      category.treatments = category.treatments.filter(
        (treatment: Treatment) => treatment.id !== id
      )
      await writeData('price-list', priceList)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}

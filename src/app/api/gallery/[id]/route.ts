import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { createSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured', details: 'Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY' },
        { status: 503 }
      )
    }

    const { id } = await params

    const supabase = createSupabaseAdmin()

    const { data: item, error: fetchError } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', parseInt(id, 10))
      .single()

    if (fetchError || !item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    const storagePath = (item as { storage_path?: string }).storage_path

    const { error: deleteError } = await supabase.from('gallery').delete().eq('id', parseInt(id, 10))

    if (deleteError) {
      console.error('Gallery delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete gallery item', details: deleteError.message },
        { status: 500 }
      )
    }

    await supabase.from('images').delete().eq('id', `gallery-${id}`)

    if (storagePath) {
      await supabase.storage.from('images').remove([storagePath])
    } else {
      const imagePath = (item as { image?: string }).image || ''
      const fileName = imagePath.split('/').pop()
      if (fileName) {
        await supabase.storage.from('images').remove([`images/${fileName}`])
      }
    }

    return NextResponse.json({ success: true, message: 'Gallery image deleted' })
  } catch (error) {
    console.error('Gallery delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery image', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

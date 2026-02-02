import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { createSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
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

    const { imageId, description, location } = await request.json()

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()
    const updates: Record<string, unknown> = {
      last_updated: new Date().toISOString(),
      uploaded_by: 'admin',
    }
    if (typeof description === 'string' && description.trim()) {
      updates.description = description.trim()
    }
    if (typeof location === 'string' && location.trim()) {
      updates.location = location.trim()
    }

    const { data, error } = await supabase
      .from('images')
      .update(updates)
      .eq('id', imageId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 })
      }
      throw error
    }

    if (imageId.startsWith('gallery-') && typeof description === 'string' && description.trim()) {
      const galleryId = imageId.replace('gallery-', '')
      await supabase
        .from('gallery')
        .update({ title: description.trim() })
        .eq('id', parseInt(galleryId, 10))
    }

    return NextResponse.json({
      success: true,
      message: 'Image metadata updated successfully',
      image: {
        ...data,
        currentFile: data.current_file,
        lastUpdated: data.last_updated,
        uploadedBy: data.uploaded_by,
      },
    })
  } catch (error) {
    console.error('Metadata update error:', error)
    return NextResponse.json(
      { error: 'Failed to update image metadata', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

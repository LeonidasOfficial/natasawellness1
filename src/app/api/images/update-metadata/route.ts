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
    
    // First try to get existing row
    const { data: existing } = await supabase
      .from('images')
      .select('*')
      .eq('id', imageId)
      .single()

    // Determine values - use existing or derive from imageId
    const descValue = typeof description === 'string' && description.trim() ? description.trim() : (existing?.description || '')
    const locValue = typeof location === 'string' && location.trim() ? location.trim() : (existing?.location || '')
    
    // Derive category and type from imageId if creating new row
    let category = existing?.category || 'Gallery'
    let type = existing?.type || 'gallery'
    if (!existing) {
      if (imageId.startsWith('hero-')) {
        category = 'Hero Section'
        type = 'hero'
      } else if (imageId === 'about') {
        category = 'About Section'
        type = 'content'
      } else if (imageId.startsWith('service-') || imageId.includes('manicure') || imageId.includes('massage') || imageId.includes('facial')) {
        category = 'Services'
        type = 'icon'
      } else if (imageId === 'page-header') {
        category = 'Page Headers'
        type = 'background'
      }
    }

    // Use upsert to create or update the row
    const upsertData = {
      id: imageId,
      path: existing?.path || `/img/${imageId.replace('gallery-', 'gallery-')}.jpg`,
      storage_path: existing?.storage_path || null,
      category,
      description: descValue,
      location: locValue,
      current_file: existing?.current_file || `${imageId}.jpg`,
      type,
      last_updated: new Date().toISOString(),
      uploaded_by: 'admin',
    }

    const { data, error } = await supabase
      .from('images')
      .upsert(upsertData, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
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

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { createSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('[Images Upload] Starting request')
    
    const authResult = await verifyAuth(request)
    console.log('[Images Upload] Auth result:', authResult.isValid ? 'valid' : 'invalid')
    
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured', details: 'Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY' },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const imageId = formData.get('imageId') as string
    const currentFile = formData.get('currentFile') as string
    const path = formData.get('path') as string
    const description = (formData.get('description') as string) || ''
    const location = (formData.get('location') as string) || ''

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.' }, { status: 400 })
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()
    const storagePath = `images/${currentFile}`

    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(storagePath, buffer, { upsert: true, contentType: imageFile.type })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload image', details: uploadError.message },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(storagePath)
    const publicUrl = urlData.publicUrl

    // Get existing row data if any (to preserve category/type)
    const { data: existing } = await supabase
      .from('images')
      .select('category, type')
      .eq('id', imageId)
      .single()

    // Derive category and type from imageId if creating new row
    let category = existing?.category || 'Gallery'
    let type = existing?.type || 'gallery'
    if (!existing) {
      if (imageId.startsWith('hero-')) {
        category = 'Hero Section'
        type = imageId === 'hero-bg' ? 'background' : 'hero'
      } else if (imageId === 'about') {
        category = 'About Section'
        type = 'content'
      } else if (imageId.startsWith('service-') || ['skin-care', 'manicure', 'pedicure', 'makeup', 'haircut', 'massage', 'facials', 'waxing', 'eyelashes', 'spraytan'].includes(imageId)) {
        category = 'Services'
        type = 'icon'
      } else if (imageId === 'page-header') {
        category = 'Page Headers'
        type = 'background'
      }
    }

    // Use upsert to create the row if it doesn't exist (e.g., when Supabase tables are empty)
    const { error: upsertError } = await supabase
      .from('images')
      .upsert({
        id: imageId,
        path: publicUrl,
        storage_path: storagePath,
        category,
        description: description || '',
        location: location || '',
        current_file: currentFile,
        type,
        last_updated: new Date().toISOString(),
        uploaded_by: 'admin',
      }, { onConflict: 'id' })

    if (upsertError) {
      console.error('Metadata upsert error:', upsertError)
      return NextResponse.json(
        { error: 'Failed to save metadata', details: upsertError.message },
        { status: 500 }
      )
    }

    console.log('[Images Upload] Success, path:', publicUrl)
    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      path: publicUrl,
      storagePath,
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

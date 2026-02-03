import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { createSupabaseAdmin } from '@/lib/supabase'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

async function getStaticGallery() {
  const galleryPath = join(process.cwd(), 'src', 'data', 'gallery.json')
  return JSON.parse(await readFile(galleryPath, 'utf-8'))
}

export async function GET() {
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  }
  
  try {
    // If Supabase is configured, return Supabase data
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createSupabaseAdmin()
      
      // Get ALL gallery items from Supabase, ordered by id DESC to get newest first
      const { data, error } = await supabase
        .from('gallery')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false })
        .limit(1000)
      
      if (!error) {
        // Always return Supabase data if available, even if empty
        const galleryItems = (data || []).map((row) => ({
          id: String(row.id),
          title: row.title,
          category: row.category,
          image: row.image,
          featured: row.featured ?? true,
        }))
        
        console.log(`[Gallery API] Returning ${galleryItems.length} gallery items from Supabase (total in DB: ${data?.length || 0})`)
        return NextResponse.json(galleryItems, { headers })
      }
      
      if (error) {
        console.error('Supabase gallery query error:', error)
        // Don't fall back to static if there's a real error - return empty array
        return NextResponse.json([], { headers })
      }
    }

    // Fallback to static gallery
    const staticGallery = await getStaticGallery()
    return NextResponse.json(staticGallery, { headers })
  } catch (error) {
    console.error('Failed to read gallery:', error)
    return NextResponse.json({ error: 'Failed to load gallery' }, { status: 500, headers })
  }
}

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const title = (formData.get('title') as string) || 'New Gallery Image'
    const category = (formData.get('category') as string) || 'facial'

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    const extension = imageFile.name.split('.').pop() || 'jpg'
    const uniqueName = `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`
    const storagePath = `images/${uniqueName}`

    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(storagePath, buffer, { contentType: imageFile.type })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload image', details: uploadError.message },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(storagePath)
    const publicUrl = urlData.publicUrl

    const newGalleryItem = {
      title,
      category,
      image: publicUrl,
      storage_path: storagePath,
      featured: true,
    }

    const { data: inserted, error: insertError } = await supabase.from('gallery').insert(newGalleryItem).select().single()

    if (insertError) {
      console.error('Gallery insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to add gallery image', details: insertError.message },
        { status: 500 }
      )
    }

    const lastUpdated = new Date().toISOString()
    
    const newImageMeta = {
      id: `gallery-${inserted.id}`,
      path: publicUrl,
      storage_path: storagePath,
      category: 'Gallery',
      location: `Gallery Page - ${title}`,
      description: `Gallery image - ${title}`,
      current_file: uniqueName,
      type: 'gallery',
      last_updated: lastUpdated,
      uploaded_by: 'admin',
    }

    // Use upsert instead of insert to handle conflicts
    const { error: imagesInsertError } = await supabase
      .from('images')
      .upsert(newImageMeta, { onConflict: 'id' })
      .select()
    
    if (imagesInsertError) {
      console.error('Images table upsert error:', imagesInsertError)
      // Don't fail the request, but log the error
    } else {
      console.log(`[Gallery API] Successfully saved image metadata with id: ${newImageMeta.id}`)
    }

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }

    return NextResponse.json({
      success: true,
      item: {
        id: String(inserted.id),
        title: inserted.title,
        category: inserted.category,
        image: inserted.image,
        featured: inserted.featured ?? true,
      },
      image: {
        id: `gallery-${inserted.id}`,
        path: publicUrl,
        category: 'Gallery',
        location: `Gallery Page - ${title}`,
        description: `Gallery image - ${title}`,
        currentFile: uniqueName,
        type: 'gallery',
        lastUpdated,
        uploadedBy: 'admin',
      },
    }, { headers })
  } catch (error) {
    console.error('Gallery add error:', error)
    return NextResponse.json(
      { error: 'Failed to add gallery image', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

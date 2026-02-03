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
  const headers: Record<string, string> = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  }
  
  try {
    // If Supabase is configured, return Supabase data
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createSupabaseAdmin()
      
      // Get all gallery items from Supabase
      const { data, error } = await supabase.from('gallery').select('*').limit(1000)
      
      headers['X-Supabase-Rows'] = String(data?.length ?? 0)
      headers['X-Supabase-Error'] = error?.message ?? 'none'
      
      if (!error && data && data.length > 0) {
        const galleryItems = data.map((row) => ({
          id: String(row.id),
          title: row.title,
          category: row.category,
          image: row.image,
          featured: row.featured ?? true,
        }))
        
        headers['X-Source'] = 'supabase'
        return NextResponse.json(galleryItems, { headers })
      }
      
      if (error) {
        console.error('Supabase gallery query error:', error)
      }
    }

    // Fallback to static gallery
    const staticGallery = await getStaticGallery()
    headers['X-Source'] = 'static'
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

    const newImageMeta = {
      id: `gallery-${inserted.id}`,
      path: publicUrl,
      storage_path: storagePath,
      category: 'Gallery',
      location: `Gallery Page - ${title}`,
      description: `Gallery image - ${title}`,
      current_file: uniqueName,
      type: 'gallery',
    }

    const { error: imagesInsertError } = await supabase.from('images').insert(newImageMeta)
    if (imagesInsertError) {
      console.error('Images table insert error:', imagesInsertError)
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
    })
  } catch (error) {
    console.error('Gallery add error:', error)
    return NextResponse.json(
      { error: 'Failed to add gallery image', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

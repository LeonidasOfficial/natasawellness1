import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

function mapImageRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    path: row.path,
    category: row.category,
    location: row.location,
    description: row.description,
    currentFile: row.current_file,
    type: row.type,
    lastUpdated: row.last_updated,
    uploadedBy: row.uploaded_by,
  }
}

async function getStaticImages() {
  const imagesMetadataPath = join(process.cwd(), 'src', 'data', 'images.json')
  return JSON.parse(await readFile(imagesMetadataPath, 'utf-8'))
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
      
      // Get all images from Supabase, ordered by last_updated DESC to get newest first
      const { data, error } = await supabase
        .from('images')
        .select('*', { count: 'exact' })
        .order('last_updated', { ascending: false, nullsFirst: false })
        .limit(1000)
      
      if (!error && data && data.length > 0) {
        // Map and return the data
        const mappedData = data.map(mapImageRow)
        console.log(`[API] Returning ${mappedData.length} images from Supabase`)
        return NextResponse.json(mappedData, { headers })
      }
      
      // If no data but no error, return empty array instead of falling back
      if (!error && (!data || data.length === 0)) {
        console.log('[API] No images found in Supabase, returning empty array')
        return NextResponse.json([], { headers })
      }
      
      if (error) {
        console.error('Supabase query error:', error)
      }
    }

    // Fallback to static images
    const staticImages = await getStaticImages()
    return NextResponse.json(staticImages, { headers })
  } catch (error) {
    console.error('Failed to read images:', error)
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500, headers })
  }
}

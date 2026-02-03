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
  const headers: Record<string, string> = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  }
  
  try {
    // If Supabase is configured, return Supabase data
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createSupabaseAdmin()
      
      // Get all images from Supabase - use explicit limit
      const { data, error } = await supabase.from('images').select('*').limit(1000)
      
      // Debug headers
      headers['X-Supabase-Rows'] = String(data?.length ?? 0)
      headers['X-Supabase-Error'] = error?.message ?? 'none'
      
      if (!error && data && data.length > 0) {
        // Return all Supabase data directly
        headers['X-Source'] = 'supabase'
        return NextResponse.json(data.map(mapImageRow), { headers })
      }
      
      // If Supabase query failed or returned empty, fall back to static
      if (error) {
        console.error('Supabase query error:', error)
      }
    }

    // Fallback to static images
    const staticImages = await getStaticImages()
    headers['X-Source'] = 'static'
    return NextResponse.json(staticImages, { headers })
  } catch (error) {
    console.error('Failed to read images:', error)
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500, headers })
  }
}

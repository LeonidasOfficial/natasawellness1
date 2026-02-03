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
    // Always start with static images as base
    const staticImages = await getStaticImages()
    
    // If Supabase is configured, merge any updated data from there
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createSupabaseAdmin()
      
      // Note: Don't use .order('id') - causes issues with TEXT primary keys and RLS in Supabase
      const { data, error } = await supabase.from('images').select('*')
      
      if (!error && data && data.length > 0) {
        // Create a map of Supabase images by ID for fast lookup
        const supabaseMap = new Map(data.map(row => [row.id, mapImageRow(row)]))
        
        // Merge: use Supabase data where available, otherwise static
        const merged = staticImages.map((staticImg: Record<string, unknown>) => {
          const supabaseVersion = supabaseMap.get(staticImg.id as string)
          return supabaseVersion || staticImg
        })
        
        // Also include any Supabase images not in static (e.g., new gallery items)
        const staticIds = new Set(staticImages.map((img: Record<string, unknown>) => img.id))
        const newImages = data
          .filter(row => !staticIds.has(row.id))
          .map(mapImageRow)
        
        return NextResponse.json([...merged, ...newImages], { headers })
      }
    }

    return NextResponse.json(staticImages, { headers })
  } catch (error) {
    console.error('Failed to read images:', error)
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500, headers })
  }
}

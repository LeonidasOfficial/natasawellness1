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

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createSupabaseAdmin()
      const { data, error } = await supabase.from('images').select('*').order('id')
      if (error) throw error
      return NextResponse.json((data || []).map(mapImageRow))
    }

    // Fallback to JSON file (local dev without Supabase)
    const imagesMetadataPath = join(process.cwd(), 'src', 'data', 'images.json')
    const imagesData = JSON.parse(await readFile(imagesMetadataPath, 'utf-8'))
    return NextResponse.json(imagesData)
  } catch (error) {
    console.error('Failed to read images:', error)
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500 })
  }
}

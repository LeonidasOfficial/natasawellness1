import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const imagesMetadataPath = join(process.cwd(), 'src', 'data', 'images.json')
    const imagesData = JSON.parse(await readFile(imagesMetadataPath, 'utf-8'))
    
    return NextResponse.json(imagesData)
  } catch (error) {
    console.error('Failed to read images metadata:', error)
    return NextResponse.json(
      { error: 'Failed to load images' },
      { status: 500 }
    )
  }
}

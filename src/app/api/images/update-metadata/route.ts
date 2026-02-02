import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

interface ImageItem {
  id: string
  path: string
  category: string
  location: string
  description: string
  currentFile: string
  type: string
  lastUpdated?: string
  uploadedBy?: string
}

interface GalleryItem {
  id: string
  title: string
  category: string
  image: string
  featured: boolean
}

export async function PUT(request: NextRequest) {
  try {
    // Check if running on Vercel (read-only file system)
    if (process.env.VERCEL) {
      return NextResponse.json(
        { 
          error: 'Read-only mode', 
          details: 'Image editing is not available on production. Vercel uses a read-only file system. Please run locally with npm run dev to make changes.' 
        }, 
        { status: 403 }
      )
    }

    const authResult = await verifyAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageId, description, location } = await request.json()

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    const imagesMetadataPath = join(process.cwd(), 'src', 'data', 'images.json')
    const imagesData = JSON.parse(await readFile(imagesMetadataPath, 'utf-8')) as ImageItem[]

    const imageIndex = imagesData.findIndex((img) => img.id === imageId)
    if (imageIndex === -1) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    if (typeof description === 'string' && description.trim()) {
      imagesData[imageIndex].description = description.trim()
    }
    if (typeof location === 'string' && location.trim()) {
      imagesData[imageIndex].location = location.trim()
    }
    imagesData[imageIndex].lastUpdated = new Date().toISOString()
    imagesData[imageIndex].uploadedBy = 'admin'

    await writeFile(imagesMetadataPath, JSON.stringify(imagesData, null, 2), 'utf-8')

    // Sync gallery title when editing gallery images (displayed on site comes from gallery.json)
    if (imageId.startsWith('gallery-') && typeof description === 'string' && description.trim()) {
      const galleryId = imageId.replace('gallery-', '')
      const galleryPath = join(process.cwd(), 'src', 'data', 'gallery.json')
      const galleryData = JSON.parse(await readFile(galleryPath, 'utf-8')) as GalleryItem[]
      const galleryIndex = galleryData.findIndex((item) => item.id === galleryId)
      if (galleryIndex !== -1) {
        galleryData[galleryIndex].title = description.trim()
        await writeFile(galleryPath, JSON.stringify(galleryData, null, 2), 'utf-8')
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Image metadata updated successfully',
      image: imagesData[imageIndex]
    })
  } catch (error) {
    console.error('Metadata update error:', error)
    return NextResponse.json(
      { error: 'Failed to update image metadata', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

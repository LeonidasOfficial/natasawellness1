import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { readFile, writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

interface GalleryItem {
  id: string
  title: string
  category: string
  image: string
  featured: boolean
}

interface ImageItem {
  id: string
  path: string
  category: string
  location: string
  description: string
  currentFile: string
  type: string
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if running on Vercel (read-only file system)
    if (process.env.VERCEL) {
      return NextResponse.json(
        { 
          error: 'Read-only mode', 
          details: 'Deleting images is not available on production. Vercel uses a read-only file system. Please run locally with npm run dev to make changes.' 
        }, 
        { status: 403 }
      )
    }

    const authResult = await verifyAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const galleryPath = join(process.cwd(), 'src', 'data', 'gallery.json')
    const imagesPath = join(process.cwd(), 'src', 'data', 'images.json')

    const galleryData = JSON.parse(await readFile(galleryPath, 'utf-8')) as GalleryItem[]
    const imagesData = JSON.parse(await readFile(imagesPath, 'utf-8')) as ImageItem[]

    const galleryIndex = galleryData.findIndex(item => item.id === id)
    if (galleryIndex === -1) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    const item = galleryData[galleryIndex]
    const imageFileName = item.image.replace('/img/', '')

    galleryData.splice(galleryIndex, 1)
    await writeFile(galleryPath, JSON.stringify(galleryData, null, 2), 'utf-8')

    const imageMetaId = `gallery-${id}`
    const imagesFiltered = imagesData.filter(img => img.id !== imageMetaId)
    await writeFile(imagesPath, JSON.stringify(imagesFiltered, null, 2), 'utf-8')

    const filePath = join(process.cwd(), 'public', 'img', imageFileName)
    if (existsSync(filePath)) {
      try {
        await unlink(filePath)
      } catch (e) {
        console.warn('Could not delete file:', filePath, e)
      }
    }

    return NextResponse.json({ success: true, message: 'Gallery image deleted' })
  } catch (error) {
    console.error('Gallery delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery image', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

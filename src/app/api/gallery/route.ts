import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { readFile, writeFile, mkdir, access } from 'fs/promises'
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

export async function GET() {
  try {
    const galleryPath = join(process.cwd(), 'src', 'data', 'gallery.json')
    const data = JSON.parse(await readFile(galleryPath, 'utf-8'))
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to read gallery:', error)
    return NextResponse.json({ error: 'Failed to load gallery' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if running on Vercel (read-only file system)
    if (process.env.VERCEL) {
      return NextResponse.json(
        { 
          error: 'Read-only mode', 
          details: 'Adding images is not available on production. Vercel uses a read-only file system. Please run locally with npm run dev to make changes.' 
        }, 
        { status: 403 }
      )
    }

    const authResult = await verifyAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const title = (formData.get('title') as string) || 'New Gallery Image'
    const category = (formData.get('category') as string) || 'hair'

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

    const galleryPath = join(process.cwd(), 'src', 'data', 'gallery.json')
    const imagesPath = join(process.cwd(), 'src', 'data', 'images.json')
    const uploadDir = join(process.cwd(), 'public', 'img')

    const galleryData = JSON.parse(await readFile(galleryPath, 'utf-8')) as GalleryItem[]
    const imagesData = JSON.parse(await readFile(imagesPath, 'utf-8')) as ImageItem[]

    const maxId = galleryData.reduce((max, item) => Math.max(max, parseInt(item.id) || 0), 0)
    const newId = String(maxId + 1)
    const extension = imageFile.name.split('.').pop() || 'jpg'
    const newFileName = `gallery-${newId}.${extension}`
    const imagePath = `/img/${newFileName}`

    try {
      await access(uploadDir)
    } catch {
      await mkdir(uploadDir, { recursive: true })
    }

    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(join(uploadDir, newFileName), buffer)

    const newGalleryItem: GalleryItem = {
      id: newId,
      title,
      category,
      image: imagePath,
      featured: true
    }
    galleryData.push(newGalleryItem)
    await writeFile(galleryPath, JSON.stringify(galleryData, null, 2), 'utf-8')

    const newImageMeta: ImageItem = {
      id: `gallery-${newId}`,
      path: imagePath,
      category: 'Gallery',
      location: `Gallery Page - ${title}`,
      description: `Gallery image - ${title}`,
      currentFile: newFileName,
      type: 'gallery'
    }
    imagesData.push(newImageMeta)
    await writeFile(imagesPath, JSON.stringify(imagesData, null, 2), 'utf-8')

    return NextResponse.json({ success: true, item: newGalleryItem })
  } catch (error) {
    console.error('Gallery add error:', error)
    return NextResponse.json(
      { error: 'Failed to add gallery image', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

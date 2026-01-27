import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { writeFile, mkdir, access } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const imageId = formData.get('imageId') as string
    const currentFile = formData.get('currentFile') as string
    const path = formData.get('path') as string
    const description = formData.get('description') as string || ''
    const location = formData.get('location') as string || ''

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // Get file extension from original file or uploaded file
    const originalExtension = currentFile.split('.').pop() || 'jpg'
    const newFileName = currentFile // Keep the same filename to maintain references

    // Convert file to buffer
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine the upload directory (public/img)
    const uploadDir = join(process.cwd(), 'public', 'img')
    
    // Ensure directory exists
    try {
      await access(uploadDir)
    } catch {
      await mkdir(uploadDir, { recursive: true })
    }

    // Create backup of old file if it exists
    const oldFilePath = join(uploadDir, currentFile)
    if (existsSync(oldFilePath)) {
      const backupFileName = `${currentFile}.backup.${Date.now()}`
      const backupPath = join(uploadDir, backupFileName)
      const { readFile } = await import('fs/promises')
      const oldFileBuffer = await readFile(oldFilePath)
      await writeFile(backupPath, oldFileBuffer)
    }

    // Save new file
    const filePath = join(uploadDir, newFileName)
    await writeFile(filePath, buffer)

    // Update image metadata to track the change
    try {
      const { readFile, writeFile: writeFileJSON } = await import('fs/promises')
      const imagesMetadataPath = join(process.cwd(), 'src', 'data', 'images.json')
      const imagesData = JSON.parse(await readFile(imagesMetadataPath, 'utf-8')) as ImageItem[]
      
      const imageIndex = imagesData.findIndex((img) => img.id === imageId)
      if (imageIndex !== -1) {
        imagesData[imageIndex].lastUpdated = new Date().toISOString()
        imagesData[imageIndex].uploadedBy = 'admin'
        if (description) imagesData[imageIndex].description = description
        if (location) imagesData[imageIndex].location = location
        await writeFileJSON(imagesMetadataPath, JSON.stringify(imagesData, null, 2), 'utf-8')
      }
    } catch (metadataError) {
      console.warn('Could not update image metadata:', metadataError)
      // Don't fail the upload if metadata update fails
    }

    console.log(`✅ Image saved to: ${filePath}`)
    console.log(`📁 File persisted to project directory: ${uploadDir}`)

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully and saved to project',
      newFileName: newFileName,
      path: path,
      filePath: filePath,
      backupCreated: existsSync(oldFilePath),
      savedToProject: true
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

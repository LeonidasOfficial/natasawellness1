import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { imageId, description, location } = await request.json()

    if (!imageId || !description || !location) {
      return NextResponse.json(
        { error: 'Image ID, description, and location are required' },
        { status: 400 }
      )
    }

    // Update image metadata
    const imagesMetadataPath = join(process.cwd(), 'src', 'data', 'images.json')
    const imagesData = JSON.parse(await readFile(imagesMetadataPath, 'utf-8'))
    
    const imageIndex = imagesData.findIndex((img: any) => img.id === imageId)
    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Update description and location
    imagesData[imageIndex].description = description
    imagesData[imageIndex].location = location
    imagesData[imageIndex].lastUpdated = new Date().toISOString()
    imagesData[imageIndex].uploadedBy = 'admin'

    // Save updated metadata
    await writeFile(imagesMetadataPath, JSON.stringify(imagesData, null, 2), 'utf-8')

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

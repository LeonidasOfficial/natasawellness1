'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  FaImage, 
  FaUpload, 
  FaTimes, 
  FaCheck, 
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import imageMetadata from '@/data/images.json'

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

export default function ImageManagementPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [images, setImages] = useState<ImageItem[]>([])
  const [filteredImages, setFilteredImages] = useState<ImageItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null)
  const [editedDescription, setEditedDescription] = useState<string>('')
  const [editedLocation, setEditedLocation] = useState<string>('')

  useEffect(() => {
    checkAuth()
    loadImages()
  }, [])

  useEffect(() => {
    filterImages()
  }, [selectedCategory, searchQuery, images])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/verify')
      const data = await res.json()
      if (!data.authenticated) {
        router.push('/admin/login')
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const loadImages = async () => {
    try {
      // Fetch fresh image metadata from the API to ensure we have the latest data
      const res = await fetch('/api/images')
      if (res.ok) {
        const data = await res.json()
        setImages(data)
        setFilteredImages(data)
      } else {
        // Fallback to static import if API fails
        setImages(imageMetadata as ImageItem[])
        setFilteredImages(imageMetadata as ImageItem[])
      }
    } catch (error) {
      // Fallback to static import on error
      setImages(imageMetadata as ImageItem[])
      setFilteredImages(imageMetadata as ImageItem[])
    }
  }

  const filterImages = () => {
    let filtered = [...images]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(img => 
        img.location.toLowerCase().includes(query) ||
        img.description.toLowerCase().includes(query) ||
        img.currentFile.toLowerCase().includes(query)
      )
    }

    setFilteredImages(filtered)
  }

  const categories = ['all', ...Array.from(new Set(images.map(img => img.category)))]

  const handleImageSelect = (image: ImageItem) => {
    setSelectedImage(image)
    setNewImageFile(null)
    setNewImagePreview(null)
    setEditedDescription(image.description)
    setEditedLocation(image.location)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      setNewImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveMetadata = async () => {
    if (!selectedImage) return

    try {
      const res = await fetch('/api/images/update-metadata', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageId: selectedImage.id,
          description: editedDescription,
          location: editedLocation
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('✅ Image title and location updated successfully!')
        // Update the image metadata locally
        const updatedImages = images.map(img => 
          img.id === selectedImage.id 
            ? { ...img, description: editedDescription, location: editedLocation }
            : img
        )
        setImages(updatedImages)
        setSelectedImage({ ...selectedImage, description: editedDescription, location: editedLocation })
        loadImages() // Reload to get latest data
      } else {
        toast.error(data.error || 'Failed to update image metadata')
      }
    } catch (error) {
      toast.error('Failed to update image metadata')
      console.error(error)
    }
  }

  const handleUpload = async () => {
    if (!selectedImage || !newImageFile) {
      toast.error('Please select an image and choose a file')
      return
    }

    setUploadingImage(selectedImage.id)

    try {
      const formData = new FormData()
      formData.append('image', newImageFile)
      formData.append('imageId', selectedImage.id)
      formData.append('currentFile', selectedImage.currentFile)
      formData.append('path', selectedImage.path)
      formData.append('description', editedDescription)
      formData.append('location', editedLocation)

      const res = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('✅ Image saved successfully to project files! Changes will persist after deployment.', {
          duration: 5000
        })
        // Update the image metadata
        const updatedImages = images.map(img => 
          img.id === selectedImage.id 
            ? { 
                ...img, 
                currentFile: data.newFileName, 
                description: editedDescription, 
                location: editedLocation
              }
            : img
        )
        setImages(updatedImages)
        setFilteredImages(updatedImages.filter(img => 
          selectedCategory === 'all' ? true : img.category === selectedCategory
        ))
        setSelectedImage(null)
        setNewImageFile(null)
        setNewImagePreview(null)
        // Reload images from source to get fresh data without page reload
        await loadImages()
      } else {
        toast.error(data.error || 'Failed to upload image')
      }
    } catch (error) {
      toast.error('Failed to upload image')
      console.error(error)
    } finally {
      setUploadingImage(null)
    }
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="min-h-screen bg-light">
      <main className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-dark hover:bg-primary-dark transition-colors"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="font-playfair text-4xl font-bold text-dark flex items-center gap-3">
                <FaImage className="text-primary" />
                Image Management
              </h1>
              <p className="text-gray-600 mt-1">Manage all images on your website</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search images by location or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => handleImageSelect(image)}
            >
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={`${image.path}?t=${image.lastUpdated ? new Date(image.lastUpdated).getTime() : Date.now()}`}
                  alt={image.description}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/img/placeholder.jpg'
                  }}
                  key={`${image.id}-${image.lastUpdated || ''}`}
                />
                <div className="absolute top-2 right-2 bg-primary text-dark px-2 py-1 rounded text-xs font-semibold">
                  {image.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-dark mb-2 line-clamp-1">{image.location}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{image.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-mono">{image.currentFile}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewImage(image.path)
                    }}
                    className="text-primary hover:text-primary-dark transition-colors"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No images found matching your criteria</p>
          </div>
        )}

        {/* Upload Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setSelectedImage(null)
                setNewImageFile(null)
                setNewImagePreview(null)
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-primary to-primary-light p-6 relative">
                  <button
                    onClick={() => {
                      setSelectedImage(null)
                      setNewImageFile(null)
                      setNewImagePreview(null)
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-dark/20 hover:bg-dark/40 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FaTimes className="text-dark" />
                  </button>
                  <h2 className="font-playfair text-3xl font-bold text-dark pr-12">
                    Replace Image: {selectedImage.location}
                  </h2>
                  <p className="text-dark/80 mt-2">{selectedImage.description}</p>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Current Image */}
                    <div>
                      <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
                        <FaImage className="text-primary" />
                        Current Image
                      </h3>
                      <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                        <img
                          src={`${selectedImage.path}?t=${selectedImage.lastUpdated ? new Date(selectedImage.lastUpdated).getTime() : Date.now()}`}
                          alt="Current"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/img/placeholder.jpg'
                          }}
                          key={`current-${selectedImage.id}-${selectedImage.lastUpdated || ''}`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center font-mono">
                        {selectedImage.currentFile}
                      </p>
                    </div>

                    {/* New Image Preview */}
                    <div>
                      <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
                        <FaUpload className="text-primary" />
                        New Image {newImagePreview ? '(Preview)' : ''}
                      </h3>
                      <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-primary">
                        {newImagePreview ? (
                          <img
                            src={newImagePreview}
                            alt="New"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">No image selected</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {newImageFile && (
                        <p className="text-xs text-gray-500 mt-2 text-center font-mono">
                          {newImageFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* File Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Choose New Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: JPG, PNG, WEBP. Max size: 5MB
                    </p>
                  </div>

                  {/* Editable Image Info */}
                  <div className="bg-light rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-dark mb-4">Image Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-dark mb-2">
                          Title / Description
                        </label>
                        <input
                          type="text"
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                          placeholder="Enter image title/description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editedLocation}
                          onChange={(e) => setEditedLocation(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                          placeholder="Enter image location"
                        />
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-semibold">Category:</span> {selectedImage.category}</p>
                        <p><span className="font-semibold">Type:</span> {selectedImage.type}</p>
                        <p><span className="font-semibold">Current File:</span> <code className="bg-white px-2 py-1 rounded">{selectedImage.currentFile}</code></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-light p-6 flex justify-between items-center">
                  <button
                    onClick={handleSaveMetadata}
                    disabled={!editedDescription.trim() || (editedDescription === selectedImage.description && editedLocation === selectedImage.location)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FaCheck /> Save Title & Location
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedImage(null)
                        setNewImageFile(null)
                        setNewImagePreview(null)
                      }}
                      className="px-6 py-3 bg-gray-200 text-dark rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={!newImageFile || uploadingImage === selectedImage.id}
                      className="px-6 py-3 bg-primary text-dark rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploadingImage === selectedImage.id ? (
                      <>
                        <LoadingSpinner />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        Upload & Replace
                      </>
                    )}
                  </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full Preview Modal */}
        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setPreviewImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-7xl w-full"
              >
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                >
                  <FaTimes className="text-white text-xl" />
                </button>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

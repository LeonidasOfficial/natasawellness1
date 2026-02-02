'use client'

import { useState, useEffect, useRef } from 'react'
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
  FaEye,
  FaTrash,
  FaPlus,
  FaExclamationTriangle
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

const SECTION_ORDER: { category: string; label: string; canAdd?: boolean; canDelete?: boolean }[] = [
  { category: 'Hero Section', label: 'Hero Section', canAdd: false, canDelete: false },
  { category: 'About Section', label: 'About Section', canAdd: false, canDelete: false },
  { category: 'Gallery', label: 'Explore Our Gallery', canAdd: true, canDelete: true },
  { category: 'Page Headers', label: 'Page Headers', canAdd: false, canDelete: false },
  { category: 'Services', label: 'Service Icons', canAdd: false, canDelete: false },
]

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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [addingGallery, setAddingGallery] = useState(false)
  const [newGalleryTitle, setNewGalleryTitle] = useState('')
  const [newGalleryCategory, setNewGalleryCategory] = useState('facial')
  const [newGalleryFile, setNewGalleryFile] = useState<File | null>(null)
  const [newGalleryPreview, setNewGalleryPreview] = useState<string | null>(null)
  const [addGalleryModalOpen, setAddGalleryModalOpen] = useState(false)
  const addGalleryFileInputRef = useRef<HTMLInputElement>(null)
  
  // Detect if running on Vercel (production) where file system is read-only
  const isVercel = typeof window !== 'undefined' && (
    window.location.hostname.includes('vercel.app') || 
    window.location.hostname !== 'localhost'
  )

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
    } catch {
      router.push('/admin/login')
    }
  }

  const loadImages = async () => {
    try {
      const res = await fetch('/api/images')
      if (res.ok) {
        const data = await res.json()
        setImages(data)
        setFilteredImages(data)
      } else {
        setImages(imageMetadata as ImageItem[])
        setFilteredImages(imageMetadata as ImageItem[])
      }
    } catch {
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

  const handleImageSelect = (image: ImageItem) => {
    setSelectedImage(image)
    setNewImageFile(null)
    setNewImagePreview(null)
    setEditedDescription(image.description)
    setEditedLocation(image.location)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      setNewImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setNewImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    } else if (file) {
      if (!file.type.startsWith('image/')) toast.error('Please select an image file')
      else toast.error('Image size must be less than 5MB')
    }
  }

  const handleSaveMetadata = async () => {
    if (!selectedImage) return
    try {
      const res = await fetch('/api/images/update-metadata', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: selectedImage.id, description: editedDescription, location: editedLocation })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('✅ Image details updated!')
        setImages(prev => prev.map(img => 
          img.id === selectedImage.id ? { ...img, description: editedDescription, location: editedLocation } : img
        ))
        setSelectedImage({ ...selectedImage, description: editedDescription, location: editedLocation })
        loadImages()
      } else if (res.status === 403 && data.error === 'Read-only mode') {
        toast.error('⚠️ Read-only mode: Run locally to edit images', { duration: 5000 })
      } else {
        toast.error(data.error || 'Failed to update')
      }
    } catch {
      toast.error('Failed to update')
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

      const res = await fetch('/api/images/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        toast.success('✅ Image saved successfully!')
        await loadImages()
        setSelectedImage(null)
        setNewImageFile(null)
        setNewImagePreview(null)
      } else if (res.status === 403 && data.error === 'Read-only mode') {
        toast.error('⚠️ Read-only mode: Run locally to upload images', { duration: 5000 })
      } else {
        toast.error(data.error || 'Failed to upload')
      }
    } catch {
      toast.error('Failed to upload')
    } finally {
      setUploadingImage(null)
    }
  }

  const handleDeleteGallery = async (image: ImageItem) => {
    const galleryId = image.id.replace('gallery-', '')
    if (!confirm(`Delete "${image.description}" from the gallery?`)) return
    setDeletingId(image.id)
    try {
      const res = await fetch(`/api/gallery/${galleryId}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        toast.success('✅ Gallery image deleted')
        await loadImages()
      } else if (res.status === 403 && data.error === 'Read-only mode') {
        toast.error('⚠️ Read-only mode: Run locally to delete images', { duration: 5000 })
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPG, PNG, etc.)')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be under 5MB')
        return
      }
      setNewGalleryFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setNewGalleryPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setNewGalleryFile(null)
      setNewGalleryPreview(null)
    }
    e.target.value = ''
  }

  const handleAddGallery = async () => {
    if (!newGalleryFile || !newGalleryTitle.trim()) {
      toast.error('Please add a title and select an image')
      return
    }
    setAddingGallery(true)
    try {
      const formData = new FormData()
      formData.append('image', newGalleryFile)
      formData.append('title', newGalleryTitle.trim())
      formData.append('category', newGalleryCategory)

      const res = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('✅ Gallery image added!')
        await loadImages()
        setAddGalleryModalOpen(false)
        setNewGalleryTitle('')
        setNewGalleryCategory('facial')
        setNewGalleryFile(null)
        setNewGalleryPreview(null)
      } else if (res.status === 403 && data.error === 'Read-only mode') {
        toast.error('⚠️ Read-only mode: Run locally to add images', { duration: 5000 })
      } else {
        toast.error(data.error || 'Failed to add')
      }
    } catch {
      toast.error('Failed to add image')
    } finally {
      setAddingGallery(false)
    }
  }

  const closeAddGalleryModal = () => {
    setAddGalleryModalOpen(false)
    setNewGalleryTitle('')
    setNewGalleryCategory('facial')
    setNewGalleryFile(null)
    setNewGalleryPreview(null)
  }

  const categories = ['all', ...SECTION_ORDER.map(s => s.category)]

  if (isLoading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen bg-light">
      <main className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-dark hover:bg-primary-dark transition-colors">
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="font-playfair text-4xl font-bold text-dark flex items-center gap-3">
                <FaImage className="text-primary" />
                Image Management
              </h1>
              <p className="text-gray-600 mt-1">Manage images by section — know exactly what you're changing</p>
            </div>
          </div>
        </div>

        {/* Production Warning Banner */}
        {isVercel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <FaExclamationTriangle className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800">Read-Only Mode (Production)</h3>
              <p className="text-amber-700 text-sm mt-1">
                Uploading, editing, and deleting images is <strong>not available</strong> on the deployed site. 
                Vercel uses a read-only file system. To manage images, run the site locally with <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">npm run dev</code> and push changes to GitHub.
              </p>
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Sections' : cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section-based layout */}
        <div className="space-y-10">
          {SECTION_ORDER.map(({ category, label, canAdd, canDelete }) => {
            const imagesToShow =
              selectedCategory === 'all'
                ? filteredImages.filter((img) => img.category === category)
                : selectedCategory === category
                  ? filteredImages
                  : []

            if (imagesToShow.length === 0 && !canAdd) return null

            return (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-6 py-4 border-b border-gray-200">
                  <h2 className="font-playfair text-2xl font-bold text-dark flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full" />
                    {label}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {imagesToShow.length} image{imagesToShow.length !== 1 ? 's' : ''}
                    {canAdd && ' • You can add and delete images here'}
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {imagesToShow.map((image) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-light rounded-xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group border-2 border-transparent hover:border-primary/30"
                        onClick={() => handleImageSelect(image)}
                      >
                        <div className="relative aspect-video bg-gray-100">
                          <img
                            src={`${image.path}?t=${image.lastUpdated ? new Date(image.lastUpdated).getTime() : Date.now()}`}
                            alt={image.description}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/img/placeholder.jpg' }}
                          />
                          <div className="absolute top-2 left-2 bg-dark/80 text-white px-2 py-1 rounded text-xs font-semibold">
                            {image.currentFile}
                          </div>
                          {canDelete && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteGallery(image) }}
                              disabled={deletingId === image.id}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-bold text-dark text-sm line-clamp-1">{image.location}</h3>
                          <p className="text-gray-600 text-xs line-clamp-2">{image.description}</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); setPreviewImage(image.path) }}
                            className="mt-2 text-primary text-xs font-semibold hover:underline flex items-center gap-1"
                          >
                            <FaEye /> Preview
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Add new card - after existing images */}
                    {canAdd && category === 'Gallery' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setAddGalleryModalOpen(true)}
                        className="aspect-video rounded-xl border-2 border-dashed border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[200px] transition-all group"
                      >
                        <div className="w-14 h-14 rounded-full bg-primary/30 group-hover:bg-primary/50 flex items-center justify-center transition-all group-hover:scale-110">
                          <FaPlus className="text-2xl text-primary" />
                        </div>
                        <span className="font-semibold text-dark text-sm">Add Image</span>
                        <span className="text-xs text-gray-500 px-3 text-center">Click to add new gallery image</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.section>
            )
          })}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No images found</p>
          </div>
        )}

        {/* Replace/Edit Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => { setSelectedImage(null); setNewImageFile(null); setNewImagePreview(null) }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              >
                <div className="bg-gradient-to-r from-primary to-primary-light p-6 relative">
                  <button onClick={() => { setSelectedImage(null); setNewImageFile(null); setNewImagePreview(null) }} className="absolute top-4 right-4 w-10 h-10 bg-dark/20 hover:bg-dark/40 rounded-full flex items-center justify-center">
                    <FaTimes className="text-dark" />
                  </button>
                  <h2 className="font-playfair text-2xl font-bold text-dark pr-12">Replace: {selectedImage.location}</h2>
                  <p className="text-dark/80 mt-1 text-sm">{selectedImage.category} • {selectedImage.currentFile}</p>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold text-dark mb-3">Current</h3>
                      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                        <img src={`${selectedImage.path}?t=${Date.now()}`} alt="Current" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/img/placeholder.jpg' }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 font-mono">{selectedImage.currentFile}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-3">New Image</h3>
                      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-primary">
                        {newImagePreview ? (
                          <img src={newImagePreview} alt="New" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">Choose file below</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="mt-2 w-full text-sm" />
                    </div>
                  </div>

                  <div className="bg-light rounded-xl p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">Title / Description</label>
                      <input type="text" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">Location</label>
                      <input type="text" value={editedLocation} onChange={(e) => setEditedLocation(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="bg-light p-6 flex justify-between items-center flex-wrap gap-3">
                  <button onClick={handleSaveMetadata} disabled={editedDescription.trim() === selectedImage.description && editedLocation.trim() === selectedImage.location} className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
                    <FaCheck /> Save Details
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => { setSelectedImage(null); setNewImageFile(null); setNewImagePreview(null) }} className="px-6 py-3 bg-gray-200 text-dark rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
                    <button onClick={handleUpload} disabled={!newImageFile || uploadingImage === selectedImage.id} className="px-6 py-3 bg-primary text-dark rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2">
                      {uploadingImage === selectedImage.id ? <><LoadingSpinner /> Uploading...</> : <><FaCheck /> Upload & Replace</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Gallery Modal */}
        <AnimatePresence>
          {addGalleryModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeAddGalleryModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              >
                <div className="bg-gradient-to-r from-primary to-primary-light p-6 relative">
                  <button onClick={closeAddGalleryModal} className="absolute top-4 right-4 w-10 h-10 bg-dark/20 hover:bg-dark/40 rounded-full flex items-center justify-center">
                    <FaTimes className="text-dark" />
                  </button>
                  <h2 className="font-playfair text-2xl font-bold text-dark pr-12 flex items-center gap-2">
                    <FaPlus className="text-primary" /> Add New Gallery Image
                  </h2>
                  <p className="text-dark/80 mt-1 text-sm">Same settings as existing images</p>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Hair Styling, Nail Art"
                      value={newGalleryTitle}
                      onChange={(e) => setNewGalleryTitle(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Category</label>
                    <select
                      value={newGalleryCategory}
                      onChange={(e) => setNewGalleryCategory(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    >
                      <option value="facial">Facial</option>
                      <option value="nails">Nails</option>
                      <option value="makeup">Makeup</option>
                      <option value="spa">Spa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Image</label>
                    <div className="flex gap-4 items-start">
                      <div className="flex-1 aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-primary/50 min-h-[120px] flex items-center justify-center">
                        {newGalleryPreview ? (
                          <img src={newGalleryPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No image selected</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                          ref={addGalleryFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAddGalleryFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => addGalleryFileInputRef.current?.click()}
                          className="px-4 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-dark transition-colors"
                        >
                          Choose Image
                        </button>
                        {newGalleryFile && (
                          <p className="text-xs text-gray-500 truncate max-w-[120px]">{newGalleryFile.name}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG, WEBP. Max 5MB</p>
                  </div>
                </div>

                <div className="bg-light p-6 flex justify-end gap-3">
                  <button onClick={closeAddGalleryModal} className="px-6 py-3 bg-gray-200 text-dark rounded-lg font-semibold hover:bg-gray-300">
                    Cancel
                  </button>
                  <button
                    onClick={handleAddGallery}
                    disabled={!newGalleryFile || !newGalleryTitle.trim() || addingGallery}
                    className="px-6 py-3 bg-primary text-dark rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {addingGallery ? <><LoadingSpinner /> Adding...</> : <><FaCheck /> Add to Gallery</>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Modal */}
        <AnimatePresence>
          {previewImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
              <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center z-10">
                <FaTimes className="text-white text-xl" />
              </button>
              <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

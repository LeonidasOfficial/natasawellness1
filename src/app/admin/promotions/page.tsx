'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  FaPercent, 
  FaSave, 
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaEdit,
  FaImage,
  FaGripVertical
} from 'react-icons/fa'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import servicesData from '@/data/services.json'

interface PromoBox {
  label: string
  percentage: number
  unit: string
  description: string
  buttonText: string
  buttonLink: string
}

interface PromoSection {
  title: string
  subtitle: string
  largeTitle: string
  promoBox: PromoBox
  backgroundImage: string
  gradientOpacity: {
    from: number
    via: number
    to: number
  }
}

interface FeaturedService {
  id: string
  name: string
  image: string
  price: number
}

interface PromotionsData {
  promoSection: PromoSection
  featuredServices: FeaturedService[]
}

export default function PromotionsManagementPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [promotions, setPromotions] = useState<PromotionsData>({
    promoSection: {
      title: 'Pricing',
      subtitle: 'Beauty Salon',
      largeTitle: 'Pricing',
      promoBox: {
        label: 'Enjoy',
        percentage: 20,
        unit: 'Off',
        description: 'Book your first appointment and enjoy 20% off on all services!',
        buttonText: 'Get 20% Off',
        buttonLink: '/booking'
      },
      backgroundImage: '/img/price-1.jpg',
      gradientOpacity: {
        from: 80,
        via: 60,
        to: 0
      }
    },
    featuredServices: []
  })

  const [editingService, setEditingService] = useState<FeaturedService | null>(null)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [serviceForm, setServiceForm] = useState({
    id: '',
    name: '',
    image: '',
    price: 0
  })

  useEffect(() => {
    checkAuth()
    loadPromotions()
  }, [])

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

  const loadPromotions = async () => {
    try {
      const res = await fetch('/api/promotions')
      if (res.ok) {
        const data = await res.json()
        setPromotions(data)
      } else {
        // Load from default file if API fails
        try {
          const defaultData = await import('@/data/promotions.json')
          setPromotions(defaultData.default)
        } catch (importError) {
          // Keep default state if import fails
          console.warn('Could not load promotions data, using defaults')
        }
      }
    } catch (error) {
      // Fallback to default
      try {
        const defaultData = await import('@/data/promotions.json')
        setPromotions(defaultData.default)
      } catch (importError) {
        console.warn('Could not load promotions data, using defaults')
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/promotions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promotions)
      })

      if (res.ok) {
        toast.success('✅ Promotions saved successfully!')
      } else {
        toast.error('Failed to save promotions')
      }
    } catch (error) {
      toast.error('Failed to save promotions')
    } finally {
      setSaving(false)
    }
  }

  const handleAddService = () => {
    setServiceForm({ id: '', name: '', image: '', price: 0 })
    setEditingService(null)
    setShowServiceModal(true)
  }

  const handleEditService = (service: FeaturedService) => {
    setServiceForm({
      id: service.id,
      name: service.name,
      image: service.image,
      price: service.price
    })
    setEditingService(service)
    setShowServiceModal(true)
  }

  const handleSaveService = () => {
    if (!serviceForm.name || !serviceForm.image || serviceForm.price <= 0) {
      toast.error('Please fill in all fields')
      return
    }

    if (editingService) {
      // Update existing
      setPromotions({
        ...promotions,
        featuredServices: promotions.featuredServices.map(s =>
          s.id === editingService.id ? { ...serviceForm, price: Number(serviceForm.price) } : s
        )
      })
    } else {
      // Add new
      const newService: FeaturedService = {
        id: Date.now().toString(),
        name: serviceForm.name,
        image: serviceForm.image,
        price: Number(serviceForm.price)
      }
      setPromotions({
        ...promotions,
        featuredServices: [...promotions.featuredServices, newService]
      })
    }

    setShowServiceModal(false)
    setEditingService(null)
    toast.success('Service updated')
  }

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to remove this service from the promotions section?')) {
      setPromotions({
        ...promotions,
        featuredServices: promotions.featuredServices.filter(s => s.id !== id)
      })
      toast.success('Service removed')
    }
  }

  const availableServices = servicesData.filter(
    service => !promotions.featuredServices.some(fs => fs.id === service.id)
  )

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
                <FaPercent className="text-primary" />
                Promotions Management
              </h1>
              <p className="text-gray-600 mt-1">Edit promotional section and featured services</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-dark px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <FaSave />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="font-playfair text-2xl font-bold text-dark mb-4">Live Preview</h2>
          <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${promotions.promoSection.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, rgba(212, 165, 116, ${promotions.promoSection.gradientOpacity.from / 100}), rgba(212, 165, 116, ${promotions.promoSection.gradientOpacity.via / 100}), rgba(212, 165, 116, ${promotions.promoSection.gradientOpacity.to / 100}))`
                }}
              />
            </div>
            <div className="relative z-10 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{promotions.promoSection.title}</h3>
              <p className="text-lg mb-4">{promotions.promoSection.subtitle}</p>
              <div className="bg-dark/80 p-4 rounded-lg inline-block">
                <p className="text-sm mb-1">{promotions.promoSection.promoBox.label}</p>
                <p className="text-4xl font-bold">{promotions.promoSection.promoBox.percentage}% {promotions.promoSection.promoBox.unit}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Promotional Content */}
          <div className="space-y-6">
            {/* Promo Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-playfair text-2xl font-bold text-dark mb-6">Promotional Content</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Title</label>
                  <input
                    type="text"
                    value={promotions.promoSection.title}
                    onChange={(e) => setPromotions({
                      ...promotions,
                      promoSection: { ...promotions.promoSection, title: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={promotions.promoSection.subtitle}
                    onChange={(e) => setPromotions({
                      ...promotions,
                      promoSection: { ...promotions.promoSection, subtitle: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Large Title</label>
                  <input
                    type="text"
                    value={promotions.promoSection.largeTitle}
                    onChange={(e) => setPromotions({
                      ...promotions,
                      promoSection: { ...promotions.promoSection, largeTitle: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Background Image</label>
                  <input
                    type="text"
                    value={promotions.promoSection.backgroundImage}
                    onChange={(e) => setPromotions({
                      ...promotions,
                      promoSection: { ...promotions.promoSection, backgroundImage: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="/img/price-1.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use image path like /img/filename.jpg</p>
                </div>
              </div>
            </div>

            {/* Promo Box */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-playfair text-2xl font-bold text-dark mb-6">Promotion Box</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Label</label>
                    <input
                      type="text"
                      value={promotions.promoSection.promoBox.label}
                      onChange={(e) => setPromotions({
                        ...promotions,
                        promoSection: {
                          ...promotions.promoSection,
                          promoBox: { ...promotions.promoSection.promoBox, label: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Percentage</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={promotions.promoSection.promoBox.percentage}
                      onChange={(e) => setPromotions({
                        ...promotions,
                        promoSection: {
                          ...promotions.promoSection,
                          promoBox: { ...promotions.promoSection.promoBox, percentage: parseInt(e.target.value) || 0 }
                        }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Unit (e.g., "Off", "%")</label>
                  <input
                    type="text"
                    value={promotions.promoSection.promoBox.unit}
                    onChange={(e) => setPromotions({
                      ...promotions,
                      promoSection: {
                        ...promotions.promoSection,
                        promoBox: { ...promotions.promoSection.promoBox, unit: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Description</label>
                  <textarea
                    value={promotions.promoSection.promoBox.description}
                    onChange={(e) => setPromotions({
                      ...promotions,
                      promoSection: {
                        ...promotions.promoSection,
                        promoBox: { ...promotions.promoSection.promoBox, description: e.target.value }
                      }
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Button Text</label>
                    <input
                      type="text"
                      value={promotions.promoSection.promoBox.buttonText}
                      onChange={(e) => setPromotions({
                        ...promotions,
                        promoSection: {
                          ...promotions.promoSection,
                          promoBox: { ...promotions.promoSection.promoBox, buttonText: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Button Link</label>
                    <input
                      type="text"
                      value={promotions.promoSection.promoBox.buttonLink}
                      onChange={(e) => setPromotions({
                        ...promotions,
                        promoSection: {
                          ...promotions.promoSection,
                          promoBox: { ...promotions.promoSection.promoBox, buttonLink: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="/booking"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient Opacity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="font-playfair text-2xl font-bold text-dark mb-6">Gradient Opacity</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    From: {promotions.promoSection.gradientOpacity.from}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={promotions.promoSection.gradientOpacity.from}
                    onChange={(e) => setPromotions({
                      ...promotions,
                      promoSection: {
                        ...promotions.promoSection,
                        gradientOpacity: {
                          ...promotions.promoSection.gradientOpacity,
                          from: parseInt(e.target.value)
                        }
                      }
                    })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Via: {promotions.promoSection.gradientOpacity.via}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={promotions.promoSection.gradientOpacity.via}
                    onChange={(e) => setPromotions({
                      ...promotions,
                      promoSection: {
                        ...promotions.promoSection,
                        gradientOpacity: {
                          ...promotions.promoSection.gradientOpacity,
                          via: parseInt(e.target.value)
                        }
                      }
                    })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    To: {promotions.promoSection.gradientOpacity.to}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={promotions.promoSection.gradientOpacity.to}
                    onChange={(e) => setPromotions({
                      ...promotions,
                      promoSection: {
                        ...promotions.promoSection,
                        gradientOpacity: {
                          ...promotions.promoSection.gradientOpacity,
                          to: parseInt(e.target.value)
                        }
                      }
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Featured Services */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-2xl font-bold text-dark">Featured Services</h2>
              <button
                onClick={handleAddService}
                className="bg-primary text-dark px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <FaPlus />
                Add Service
              </button>
            </div>

            <div className="space-y-3">
              {promotions.featuredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-light rounded-xl hover:bg-primary/10 transition-colors"
                >
                  <FaGripVertical className="text-gray-400 cursor-move" />
                  <img src={service.image} alt={service.name} className="w-12 h-12 object-contain flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-dark truncate">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.price} RSD</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditService(service)}
                      className="w-9 h-9 bg-primary/20 hover:bg-primary/40 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FaEdit className="text-primary" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="w-9 h-9 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {promotions.featuredServices.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FaImage className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>No services added yet. Click "Add Service" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Service Modal */}
        {showServiceModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl"
            >
              <h3 className="font-playfair text-2xl font-bold text-dark mb-6">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Service Name</label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="e.g., Tretman Lica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Image Path</label>
                  <input
                    type="text"
                    value={serviceForm.image}
                    onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="/img/skin-care.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">Or select from available services:</p>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const selected = availableServices.find(s => s.id === e.target.value)
                        if (selected) {
                          setServiceForm({
                            id: selected.id,
                            name: selected.name,
                            image: selected.image,
                            price: selected.price
                          })
                        }
                      }
                    }}
                    className="w-full mt-2 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="">Select from existing services...</option>
                    {availableServices.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price} RSD
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Price (RSD)</label>
                  <input
                    type="number"
                    min="0"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowServiceModal(false)
                    setEditingService(null)
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-dark rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveService}
                  className="flex-1 px-4 py-3 bg-primary text-dark rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <FaSave />
                  {editingService ? 'Update' : 'Add'} Service
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaSpa,
  FaHandSparkles,
  FaEye,
  FaCut,
  FaPaintBrush,
  FaLeaf,
  FaArrowLeft
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import Link from 'next/link'

const iconOptions = [
  { value: 'face', label: 'Face/Spa', icon: FaSpa },
  { value: 'nails', label: 'Nails', icon: FaHandSparkles },
  { value: 'eyes', label: 'Eyes', icon: FaEye },
  { value: 'hair-removal', label: 'Hair Removal', icon: FaCut },
  { value: 'makeup', label: 'Makeup', icon: FaPaintBrush },
  { value: 'massage', label: 'Massage', icon: FaLeaf },
]

interface Treatment {
  id: string
  name: string
  description: string
  price: number
  price2?: number
  duration: string
  note?: string
}

interface Category {
  id: string
  category: string
  icon: string
  description: string
  treatments: Treatment[]
  footnote?: string
}

export default function AdminPriceListPage() {
  const router = useRouter()
  const [priceList, setPriceList] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showTreatmentModal, setShowTreatmentModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({
    category: '',
    icon: 'face',
    description: '',
    footnote: ''
  })

  const [treatmentForm, setTreatmentForm] = useState({
    name: '',
    description: '',
    price: 0,
    price2: 0,
    duration: '',
    note: ''
  })

  useEffect(() => {
    checkAuth()
    fetchPriceList()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/verify')
      if (!res.ok) {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const fetchPriceList = async () => {
    try {
      const res = await fetch('/api/pricelist')
      const data = await res.json()
      setPriceList(data)
    } catch (error) {
      toast.error('Failed to load price list')
    } finally {
      setLoading(false)
    }
  }

  // Category Functions
  const handleAddCategory = () => {
    setCategoryForm({ category: '', icon: 'face', description: '', footnote: '' })
    setEditingCategory(null)
    setShowCategoryModal(true)
  }

  const handleEditCategory = (category: Category) => {
    setCategoryForm({
      category: category.category,
      icon: category.icon,
      description: category.description,
      footnote: category.footnote || ''
    })
    setEditingCategory(category)
    setShowCategoryModal(true)
  }

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        // Update existing category
        await fetch(`/api/pricelist/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'category',
            data: categoryForm
          })
        })
        toast.success('✅ Changes saved successfully!')
      } else {
        // Create new category
        await fetch('/api/pricelist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'category',
            data: categoryForm
          })
        })
        toast.success('✅ Changes saved successfully!')
      }
      fetchPriceList()
      setShowCategoryModal(false)
    } catch (error) {
      toast.error('Failed to save category')
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? All treatments will be deleted.')) {
      return
    }

    try {
      await fetch(`/api/pricelist/${categoryId}?type=category`, {
        method: 'DELETE'
      })
      toast.success('✅ Changes saved successfully!')
      fetchPriceList()
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  // Treatment Functions
  const handleAddTreatment = (categoryId: string) => {
    setTreatmentForm({ name: '', description: '', price: 0, price2: 0, duration: '', note: '' })
    setEditingTreatment(null)
    setSelectedCategoryId(categoryId)
    setShowTreatmentModal(true)
  }

  const handleEditTreatment = (categoryId: string, treatment: Treatment) => {
    setTreatmentForm({
      name: treatment.name,
      description: treatment.description,
      price: treatment.price,
      price2: treatment.price2 || 0,
      duration: treatment.duration,
      note: treatment.note || ''
    })
    setEditingTreatment(treatment)
    setSelectedCategoryId(categoryId)
    setShowTreatmentModal(true)
  }

  const handleSaveTreatment = async () => {
    try {
      if (editingTreatment) {
        // Update existing treatment
        await fetch(`/api/pricelist/${editingTreatment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'treatment',
            categoryId: selectedCategoryId,
            data: treatmentForm
          })
        })
        toast.success('✅ Changes saved successfully!')
      } else {
        // Create new treatment
        await fetch('/api/pricelist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'treatment',
            categoryId: selectedCategoryId,
            data: treatmentForm
          })
        })
        toast.success('✅ Changes saved successfully!')
      }
      fetchPriceList()
      setShowTreatmentModal(false)
    } catch (error) {
      toast.error('Failed to save treatment')
    }
  }

  const handleDeleteTreatment = async (categoryId: string, treatmentId: string) => {
    if (!confirm('Are you sure you want to delete this treatment?')) {
      return
    }

    try {
      await fetch(`/api/pricelist/${treatmentId}?type=treatment&categoryId=${categoryId}`, {
        method: 'DELETE'
      })
      toast.success('✅ Changes saved successfully!')
      fetchPriceList()
    } catch (error) {
      toast.error('Failed to delete treatment')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <div className="bg-dark text-white p-6 shadow-xl">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/dashboard"
              className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
            >
              <FaArrowLeft className="text-dark" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Upravljanje Celovnikom</h1>
              <p className="text-gray-400">Dodajte, uredite ili obrišite kategorije i tretmane</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddCategory}
            className="bg-primary text-dark px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-light transition-colors"
          >
            <FaPlus /> Nova Kategorija
          </motion.button>
        </div>
      </div>

      {/* Price List Content */}
      <div className="container-custom py-8">
        <div className="space-y-8">
          {priceList.map((category) => {
            const IconOption = iconOptions.find(opt => opt.value === category.icon)
            const IconComponent = IconOption?.icon || FaSpa

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-gradient-to-r from-primary to-primary-light p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-dark rounded-xl flex items-center justify-center">
                        <IconComponent className="text-primary text-2xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-dark">{category.category}</h2>
                        <p className="text-dark/80">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="w-10 h-10 bg-dark/20 hover:bg-dark/40 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <FaEdit className="text-dark" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="w-10 h-10 bg-dark/20 hover:bg-dark/40 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <FaTrash className="text-dark" />
                      </button>
                      <button
                        onClick={() => handleAddTreatment(category.id)}
                        className="bg-dark text-primary px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-dark/90 transition-colors ml-4"
                      >
                        <FaPlus /> Novi Tretman
                      </button>
                    </div>
                  </div>
                </div>

                {/* Treatments List */}
                <div className="p-6">
                  {category.treatments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nema tretmana u ovoj kategoriji</p>
                  ) : (
                    <div className="space-y-3">
                      {category.treatments.map((treatment) => (
                        <div
                          key={treatment.id}
                          className="bg-light p-4 rounded-xl flex items-center justify-between hover:shadow-md transition-shadow"
                        >
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-dark">{treatment.name}</h3>
                            <p className="text-gray-600 text-sm">{treatment.description}</p>
                            <p className="text-primary font-semibold mt-1">{treatment.duration}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              {treatment.price2 ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-dark">{treatment.price}</span>
                                  <span className="text-xl font-bold text-primary">/</span>
                                  <span className="text-2xl font-bold text-dark">{treatment.price2}</span>
                                  <span className="text-gray-600 ml-1">RSD</span>
                                </div>
                              ) : (
                                <>
                                  <span className="text-2xl font-bold text-dark">{treatment.price}</span>
                                  <span className="text-gray-600 ml-1">RSD</span>
                                </>
                              )}
                              {treatment.note && (
                                <span className="text-primary font-bold ml-2">{treatment.note}</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditTreatment(category.id, treatment)}
                                className="w-9 h-9 bg-primary/20 hover:bg-primary/40 rounded-lg flex items-center justify-center transition-colors"
                              >
                                <FaEdit className="text-primary" />
                              </button>
                              <button
                                onClick={() => handleDeleteTreatment(category.id, treatment.id)}
                                className="w-9 h-9 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                              >
                                <FaTrash className="text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">
                {editingCategory ? 'Uredi Kategoriju' : 'Nova Kategorija'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Naziv Kategorije</label>
                  <input
                    type="text"
                    value={categoryForm.category}
                    onChange={(e) => setCategoryForm({ ...categoryForm, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="npr. Tretmani Lica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Ikona</label>
                  <select
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Opis</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    rows={3}
                    placeholder="Kratak opis kategorije..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Napomena (Opciono)</label>
                  <input
                    type="text"
                    value={categoryForm.footnote}
                    onChange={(e) => setCategoryForm({ ...categoryForm, footnote: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="npr. * uključuje depilaciju nausnica i obrva"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-dark rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Otkaži
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 px-4 py-3 bg-primary text-dark rounded-lg font-semibold hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
                >
                  <FaSave /> Sačuvaj
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Treatment Modal */}
      <AnimatePresence>
        {showTreatmentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTreatmentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">
                {editingTreatment ? 'Uredi Tretman' : 'Novi Tretman'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Naziv Tretmana</label>
                  <input
                    type="text"
                    value={treatmentForm.name}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="npr. Dubinsko Čišćenje Lica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Opis</label>
                  <textarea
                    value={treatmentForm.description}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    rows={2}
                    placeholder="Kratak opis tretmana..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Cena (RSD)</label>
                    <input
                      type="number"
                      value={treatmentForm.price}
                      onChange={(e) => setTreatmentForm({ ...treatmentForm, price: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="3500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Druga Cena (RSD) - Opciono</label>
                    <input
                      type="number"
                      value={treatmentForm.price2 || ''}
                      onChange={(e) => setTreatmentForm({ ...treatmentForm, price2: e.target.value ? parseInt(e.target.value) : 0 })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Ostavite prazno ako nema"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Trajanje</label>
                    <input
                      type="text"
                      value={treatmentForm.duration}
                      onChange={(e) => setTreatmentForm({ ...treatmentForm, duration: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="60 min"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Napomena (npr. *)</label>
                    <input
                      type="text"
                      value={treatmentForm.note}
                      onChange={(e) => setTreatmentForm({ ...treatmentForm, note: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="*"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowTreatmentModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-dark rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Otkaži
                </button>
                <button
                  onClick={handleSaveTreatment}
                  className="flex-1 px-4 py-3 bg-primary text-dark rounded-lg font-semibold hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
                >
                  <FaSave /> Sačuvaj
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import FloatingSocialButtons from '@/components/ui/FloatingBookButton'
import SectionTitle from '@/components/ui/SectionTitle'
import { 
  FaSpa, 
  FaHandSparkles, 
  FaEye, 
  FaCut, 
  FaPaintBrush, 
  FaLeaf,
  FaTimes,
  FaMoneyBillWave,
  FaHandPaper,
  FaFingerprint,
  FaHandHolding,
  FaHandPointRight,
  FaSun,
  FaHeart,
  FaStar
} from 'react-icons/fa'

import { useTranslation } from '@/contexts/TranslationContext'
import fallbackPriceList from '@/data/price-list.json'

// Icon mapping - each category has a unique icon
const iconMap: { [key: string]: any } = {
  'face': FaSpa,
  'hair-removal': FaCut,
  'pedikir': FaHandSparkles,
  'pedikir-gl': FaHandPaper,
  'manikir': FaHandHolding,
  'manikir-gl': FaFingerprint,
  'manikir-gel': FaHandPointRight,
  'eyes': FaEye,
  'wellness': FaLeaf,
  'makeup': FaPaintBrush,
  'tan': FaSun,
}

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

export default function PriceListPage() {
  const { t, translations, locale } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [priceListData, setPriceListData] = useState<Category[]>([])
  const [priceListLoading, setPriceListLoading] = useState(true)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Fetch pricelist from API; fall back to bundled data if API fails
  useEffect(() => {
    let cancelled = false
    const fallback = Array.isArray(fallbackPriceList) ? fallbackPriceList as Category[] : []
    async function fetchPriceList() {
      try {
        const res = await fetch('/api/pricelist', { cache: 'no-store' })
        const data = await res.json()
        if (cancelled) return
        if (Array.isArray(data) && data.length > 0) {
          setPriceListData(data)
        } else {
          setPriceListData(fallback)
        }
      } catch {
        if (!cancelled) setPriceListData(fallback)
      } finally {
        if (!cancelled) setPriceListLoading(false)
      }
    }
    fetchPriceList()
    return () => { cancelled = true }
  }, [])

  // Show loading state while translations are loading
  if (!translations || Object.keys(translations).length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading translations for {locale}...</p>
        </div>
      </main>
    )
  }

  // Show loading state while pricelist is loading
  if (priceListLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('priceList.title')}...</p>
        </div>
      </main>
    )
  }

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
  }

  const closeModal = () => {
    setSelectedCategory(null)
  }

  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-20 bg-gradient-to-br from-primary/20 via-white to-primary/10 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          </div>

          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="font-dancing text-4xl md:text-5xl text-primary mb-2">{t('priceList.subtitle')}</h2>
              <h1 className="font-playfair text-3xl md:text-5xl font-bold text-dark mb-4">
                {t('priceList.title')}
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                {t('priceList.description')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories Grid */}
        <section ref={ref} className="w-full section-padding bg-white">
          <div className="container-custom max-w-7xl">
            <SectionTitle 
              subtitle={t('priceList.categories')} 
              title={t('priceList.selectCategory')} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8">
              {priceListData.map((category: Category, index: number) => {
                const IconComponent = iconMap[category.icon] || FaSpa
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    onClick={() => handleCategoryClick(category)}
                    className="group relative bg-gradient-to-br from-white to-primary/5 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-primary/10 hover:border-primary/30"
                  >
                    {/* Icon */}
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <IconComponent className="text-3xl text-dark" />
                    </div>

                    {/* Content */}
                    <h3 className="font-playfair text-xl md:text-2xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                      {category.category}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm md:text-base">
                      {category.description}
                    </p>

                    {/* Treatment Count */}
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <span className="text-3xl font-bold">{category.treatments.length}</span>
                      <span className="text-sm uppercase">{t('priceList.treatments')}</span>
                    </div>

                    {/* Hover Indicator */}
                    <div className="absolute bottom-6 right-6 w-10 h-10 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <span className="text-dark text-xl">→</span>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Modal for Treatment Details */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl md:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl m-4"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-primary to-primary-light p-4 md:p-8 relative">
                  <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 bg-dark/20 hover:bg-dark/40 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Close modal"
                  >
                    <FaTimes className="text-dark text-lg md:text-xl" />
                  </button>

                  <div className="flex items-center gap-3 md:gap-4 pr-12 md:pr-0">
                    {(() => {
                      const IconComponent = iconMap[selectedCategory.icon] || FaSpa
                      return (
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-dark rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                          <IconComponent className="text-2xl md:text-3xl text-primary" />
                        </div>
                      )
                    })()}
                    <div className="min-w-0 flex-1">
                      <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold text-dark truncate">
                        {selectedCategory.category}
                      </h2>
                      <p className="text-dark/80 text-sm md:text-base truncate">
                        {selectedCategory.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Content - Treatments List */}
                <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh]">
                  <div className="space-y-2 md:space-y-3">
                    {selectedCategory.treatments.map((treatment, index) => (
                      <motion.div
                        key={treatment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-light hover:bg-primary/10 rounded-xl md:rounded-2xl p-3 md:p-4 transition-all duration-300 border-2 border-transparent hover:border-primary/30"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-playfair text-base md:text-lg font-bold text-dark mb-1 group-hover:text-primary transition-colors flex items-center gap-2 flex-wrap">
                              <span className="break-words">{treatment.name}</span>
                              {treatment.note && (
                                <span className="text-primary text-sm md:text-base font-bold flex-shrink-0">{treatment.note}</span>
                              )}
                            </h3>
                            {treatment.description && (
                              <p className="text-gray-600 mb-1 md:mb-2 text-xs md:text-sm break-words">
                                {treatment.description}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 w-full sm:w-auto">
                            {treatment.price2 ? (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                                <div className="flex items-center gap-2 bg-primary px-3 md:px-4 py-2 rounded-lg md:rounded-xl">
                                  <FaMoneyBillWave className="text-dark text-sm md:text-base" />
                                  <span className="font-bold text-lg md:text-xl text-dark">
                                    {treatment.price}
                                  </span>
                                  <span className="text-dark text-xs md:text-sm">RSD</span>
                                </div>
                                <div className="flex items-center gap-2 bg-primary px-3 md:px-4 py-2 rounded-lg md:rounded-xl">
                                  <FaMoneyBillWave className="text-dark text-sm md:text-base" />
                                  <span className="font-bold text-lg md:text-xl text-dark">
                                    {treatment.price2}
                                  </span>
                                  <span className="text-dark text-xs md:text-sm">RSD</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 bg-primary px-3 md:px-4 py-2 rounded-lg md:rounded-xl">
                                <FaMoneyBillWave className="text-dark text-sm md:text-base" />
                                <span className="font-bold text-xl md:text-2xl text-dark">
                                  {treatment.price}
                                </span>
                                <span className="text-dark text-xs md:text-sm">RSD</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {selectedCategory.footnote && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="text-primary font-bold">{selectedCategory.footnote.split(' ')[0]}</span> {selectedCategory.footnote.substring(selectedCategory.footnote.indexOf(' ') + 1)}
                      </p>
                    </div>
                  )}
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ScrollToTop />
      <FloatingSocialButtons />
    </>
  )
}

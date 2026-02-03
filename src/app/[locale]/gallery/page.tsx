'use client'

import ScrollToTop from '@/components/ui/ScrollToTop'
import SectionTitle from '@/components/ui/SectionTitle'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import galleryDataStatic from '@/data/gallery.json'
import dynamic from 'next/dynamic'

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), {
  ssr: false,
  loading: () => null
})
import { FaSearchPlus } from 'react-icons/fa'

interface GalleryItem {
  id: string
  title: string
  category: string
  image: string
  featured?: boolean
}

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [galleryData, setGalleryData] = useState<GalleryItem[]>(galleryDataStatic as GalleryItem[])

  const loadGallery = async () => {
    try {
      const res = await fetch(`/api/gallery?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setGalleryData(data)
        }
      }
    } catch (error) {
      console.error('Failed to load gallery:', error)
    }
  }

  useEffect(() => {
    loadGallery()
    
    // Refresh when window regains focus (user returns from admin)
    const handleFocus = () => {
      loadGallery()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const lightboxSlides = galleryData.map(item => ({
    src: item.image,
    title: item.title,
    description: item.category
  }))

  return (
    <>
      <section className="relative bg-light py-12 md:py-16">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-4xl md:text-6xl font-bold text-dark">
            Gallery
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-7xl">
          <SectionTitle subtitle="Our Work" title="Explore Our Portfolio" />

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
            {galleryData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setLightboxIndex(index)
                  setLightboxOpen(true)
                }}
                className="relative group overflow-hidden rounded-xl aspect-square cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Zoom Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-dark/40">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    className="w-16 h-16 bg-primary rounded-full flex items-center justify-center"
                  >
                    <FaSearchPlus className="text-dark text-2xl" />
                  </motion.div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 pointer-events-none">
                  <div className="text-white">
                    <h4 className="font-playfair text-xl font-bold mb-1">{item.title}</h4>
                    <p className="text-primary uppercase text-xs">{item.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, .95)" },
        }}
        animation={{ fade: 400 }}
        controller={{ closeOnBackdropClick: true }}
      />

      <ScrollToTop />
    </>
  )
}


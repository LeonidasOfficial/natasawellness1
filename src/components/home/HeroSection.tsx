'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { FaPhone, FaEnvelope, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Link from 'next/link'
import { useTranslation } from '@/contexts/TranslationContext'
import { useLocaleLink } from '@/hooks/useLocaleLink'
import ParallaxLayer, { FastParallaxLayer, SlowParallaxLayer, MediumParallaxLayer } from '@/components/ui/ParallaxLayer'

const HeroSection = () => {
  const { t } = useTranslation()
  const { createLink } = useLocaleLink()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  
  // Check for reduced motion - must be in useEffect for SSR
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
  }, [])
  
  // Parallax scroll progress
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Multi-layer parallax transforms
  const backgroundY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -100]
  )
  const contentY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -200]
  )
  const decorativeY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -300]
  )
  const sliderY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -150]
  )

  const slides = [
    {
      id: 1,
      image: '/img/hero-slider-1.jpg',
      title: t('hero.slide1Title'),
      subtitle: t('hero.slide1Subtitle')
    },
    {
      id: 2,
      image: '/img/hero-slider-2.jpg',
      title: t('hero.slide2Title'),
      subtitle: t('hero.slide2Subtitle')
    },
    {
      id: 3,
      image: '/img/hero-slider-3.jpg',
      title: t('hero.slide3Title'),
      subtitle: t('hero.slide3Subtitle')
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section 
      ref={heroRef}
      className="relative w-full min-h-[85vh] bg-light flex items-center overflow-hidden"
    >
      {/* Background Layer - Slowest Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: backgroundY,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/img/hero-bg.jpg)',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-light opacity-95" />
        {/* Enhanced Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30" />
      </motion.div>

      <div className="w-full relative z-10">
        <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left Content - Medium Parallax */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              y: contentY,
              willChange: prefersReducedMotion ? 'auto' : 'transform',
            }}
            className="space-y-4 lg:space-y-6 py-6 lg:py-8"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-dancing text-5xl md:text-6xl lg:text-7xl text-primary tracking-wide"
            >
              {t('hero.welcome')}
            </motion.h2>

            <motion.h1
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-dark leading-tight tracking-wide gradient-text-gold"
            >
              {t('hero.slogan')}
            </motion.h1>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                className="flex items-center gap-4 glass glass-hover p-4 rounded-lg shadow-lg cursor-pointer group backdrop-blur-xl"
              >
                <div className="w-14 h-14 bg-primary flex items-center justify-center flex-shrink-0 rounded-lg group-hover:bg-dark transition-colors duration-300">
                  <FaPhone className="text-dark group-hover:text-primary text-xl transition-colors duration-300" />
                </div>
                <div>
                  <h5 className="text-primary font-semibold text-sm uppercase mb-1">{t('hero.callUs')}</h5>
                  <p className="text-dark font-bold text-lg">063 1020 305</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                className="flex items-center gap-4 glass glass-hover p-4 rounded-lg shadow-lg cursor-pointer group backdrop-blur-xl"
              >
                <div className="w-14 h-14 bg-primary flex items-center justify-center flex-shrink-0 rounded-lg group-hover:bg-dark transition-colors duration-300">
                  <FaEnvelope className="text-dark group-hover:text-primary text-xl transition-colors duration-300" />
                </div>
                <div>
                  <h5 className="text-primary font-semibold text-sm uppercase mb-1">{t('hero.emailUs')}</h5>
                  <p className="text-dark font-bold text-lg">info@natasawellness.com</p>
                </div>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >

              <motion.button
                onClick={() => {
                  // Scroll to services section on homepage
                  const servicesSection = document.getElementById('services-section')
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-dark text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-primary hover:text-dark transition-all duration-400 shadow-xl hover:shadow-card-hover"
              >
                {t('hero.ourServicesButton') || 'Our Services'}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Image Slider - Medium Parallax */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              y: sliderY,
              willChange: prefersReducedMotion ? 'auto' : 'transform',
            }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl vignette"
              >
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/30 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="font-dancing text-2xl mb-2"
                    >
                      {slides[currentSlide].subtitle}
                    </motion.p>
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="font-playfair text-4xl font-bold"
                    >
                      {slides[currentSlide].title}
                    </motion.h3>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevSlide}
                className="w-12 h-12 bg-primary text-dark flex items-center justify-center rounded-full hover:bg-dark hover:text-primary transition-all duration-300 shadow-lg"
              >
                <FaChevronLeft />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextSlide}
                className="w-12 h-12 bg-primary text-dark flex items-center justify-center rounded-full hover:bg-dark hover:text-primary transition-all duration-300 shadow-lg"
              >
                <FaChevronRight />
              </motion.button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-primary w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
        </div>
      </div>

      {/* Modern Decorative Elements - Fastest Parallax */}
      <motion.div
        style={{
          y: decorativeY,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
        }}
        className="absolute top-20 right-10 w-20 h-20 bg-primary/20 rounded-full blur-xl floating z-0"
      />
      <motion.div
        style={{
          y: decorativeY,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
        }}
        className="absolute bottom-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl floating-slow z-0"
      />
      {/* Additional decorative particles */}
      <motion.div
        style={{
          y: decorativeY,
          x: useTransform(smoothProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 50]),
          willChange: prefersReducedMotion ? 'auto' : 'transform',
        }}
        className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary/15 rounded-full blur-lg floating z-0"
      />
    </section>
  )
}

export default HeroSection


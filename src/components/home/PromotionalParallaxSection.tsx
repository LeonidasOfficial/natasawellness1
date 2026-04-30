'use client'

import { useRef, forwardRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
import ParallaxLayer, { MediumParallaxLayer } from '@/components/ui/ParallaxLayer'
import { useTranslation } from '@/contexts/TranslationContext'

interface PromotionalParallaxSectionProps {
  promotionsData: any
  inView: boolean
}

const PromotionalParallaxSection = forwardRef<HTMLElement, PromotionalParallaxSectionProps>(
  ({ promotionsData, inView }, ref) => {
    const { t } = useTranslation()
    const sectionRef = useRef<HTMLElement>(null)
    const internalRef = (ref as React.RefObject<HTMLElement>) || sectionRef
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setPrefersReducedMotion(
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
      }
    }, [])
  
    const { scrollYProgress } = useScroll({
      target: internalRef,
      offset: ['start end', 'end start'],
    })

    const smoothProgress = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001,
    })

  // Background parallax (slowest)
  const backgroundY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -80]
  )

  // Content parallax (medium)
  const contentY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -120]
  )

    return (
      <section
        ref={internalRef}
        className="w-full section-padding relative overflow-hidden"
      >
      {/* Background Layer - Parallax */}
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
            backgroundImage: `url(${promotionsData.promoSection.backgroundImage})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, rgba(212, 165, 116, ${promotionsData.promoSection.gradientOpacity.from / 100}), rgba(212, 165, 116, ${promotionsData.promoSection.gradientOpacity.via / 100}), rgba(212, 165, 116, ${promotionsData.promoSection.gradientOpacity.to / 100}))`,
          }}
        />
      </motion.div>

      <div className="w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-full mx-auto">
          {/* Left - Promo with Parallax */}
          <MediumParallaxLayer className="bg-primary p-8 lg:p-12 flex items-center relative">
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:text-left w-full"
            >
              <h2 className="font-dancing text-white text-3xl md:text-4xl mb-1 tracking-wide">
                {t('promotions.title')}
              </h2>
              <h1 className="font-playfair text-dark text-2xl md:text-3xl mb-2 tracking-wide">
                {t('promotions.subtitle')}
              </h1>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-dark uppercase tracking-widest mb-6">
                {t('promotions.largeTitle')}
              </h1>

              <div className="grid grid-cols-1 gap-4 items-center">
                <div className="bg-dark p-5 sm:p-6 md:p-8 rounded-2xl text-center shadow-glow border border-white/10 max-w-xl mx-auto lg:mx-0">
                  <h4 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold leading-tight max-w-md mx-auto mb-3 md:mb-4">
                    {t('promotions.promoBox.label')}
                  </h4>
                  <h1 className="text-white text-6xl sm:text-7xl md:text-8xl font-bold leading-none mb-3 md:mb-4">
                    {promotionsData.promoSection.promoBox.percentage}%
                  </h1>
                  <p className="text-white/95 text-base sm:text-lg md:text-xl leading-relaxed max-w-lg mx-auto mb-5 md:mb-6">
                    {t('promotions.promoBox.unit')}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex w-full sm:w-auto items-center justify-center bg-primary text-dark text-sm sm:text-base font-semibold px-5 sm:px-6 py-3 rounded-full transition-all duration-300 hover:bg-white hover:scale-105"
                  >
                    {t('promotions.promoBox.buttonText')}
                  </Link>
                  <p className="text-white/75 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto mt-4 md:mt-5">
                    {t('promotions.promoBox.description')}
                  </p>
                </div>
              </div>
            </motion.div>
          </MediumParallaxLayer>

          {/* Right - Price List with Parallax */}
          <MediumParallaxLayer className="bg-dark p-8 lg:p-10 space-y-3 relative">
            {promotionsData.featuredServices.map((service: any, index: number) => {
              const nameKey = `services.service${service.id}.name`
              const serviceName = t(nameKey) !== nameKey ? t(nameKey) : service.name
              return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: 50, scale: 0.96 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, x: 10 }}
                className="flex items-center gap-3 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer glass-hover"
              >
                <img src={service.image} alt={serviceName} className="w-16 h-16 object-contain flex-shrink-0" />
                <div className="flex-1">
                  <h6 className="text-primary uppercase font-semibold">{serviceName}</h6>
                </div>
                <h3 className="text-white font-bold text-2xl">{service.price} RSD</h3>
              </motion.div>
            )})}
          </MediumParallaxLayer>
        </div>
      </div>
    </section>
    )
  }
)

PromotionalParallaxSection.displayName = 'PromotionalParallaxSection'

export default PromotionalParallaxSection

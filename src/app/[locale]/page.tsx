'use client'

import HeroSection from '@/components/home/HeroSection'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionTitle from '@/components/ui/SectionTitle'
import Link from 'next/link'
import { FaCalendarAlt, FaUsers, FaStar, FaArrowRight, FaQuoteLeft } from 'react-icons/fa'
import { useTranslation } from '@/contexts/TranslationContext'
import ParallaxLayer, { MediumParallaxLayer } from '@/components/ui/ParallaxLayer'
import DecorativeDivider from '@/components/ui/DecorativeDivider'
import PromotionalParallaxSection from '@/components/home/PromotionalParallaxSection'

// Import data
import servicesData from '@/data/services.json'
import teamData from '@/data/team.json'
import testimonialsData from '@/data/testimonials.json'
import galleryData from '@/data/gallery.json'
import promotionsData from '@/data/promotions.json'

export default function Home() {
  const { t, translations } = useTranslation()
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ref4, inView4] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Show loading state while translations are loading
  if (!translations || Object.keys(translations).length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 mx-auto mb-4 relative">
            <img src="/img/admin-ajax.png" alt="Loading" className="w-full h-full object-contain" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main>
        <HeroSection />

        {/* Decorative Divider */}
        <DecorativeDivider variant="wave" className="-mt-4" />

        {/* About Section */}
        <section ref={ref1} className="w-full section-padding bg-white overflow-hidden relative">
          <div className="container-custom max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              {/* Left - Image with Parallax */}
              <ParallaxLayer speed={0.3} className="relative">
                <motion.div
                  initial={{ opacity: 0, x: -50, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                <div className="image-hover-zoom rounded-2xl overflow-hidden shadow-2xl">
                  <img src="/img/about.png" alt="About Salone" className="w-full h-auto" />
                </div>
                
                {/* Contact Card */}
              </motion.div>
              </ParallaxLayer>

              {/* Right - Content with Parallax */}
              <MediumParallaxLayer className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                <div>
                  <h2 className="font-dancing text-5xl text-primary mb-2">{t('nav.about') || 'About Us'}</h2>
                  <h1 className="font-dancing text-4xl md:text-5xl text-primary font-semibold mb-4">
                    Nataša
                  </h1>
                </div>

                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  My journey in the world of beauty started in the year 2000, passionate in make-up and wanting to be a make-up artist not knowing how enormous the variety in the beauty profession would be. During my apprenticeship I loved more and more everything about cosmetics and all the different treatments such as facials, epilation and nails which interested me most. Received my diploma 2004 in Luxembourg. 2016 I completed and received my Spa Manager diploma in Spain, expanding my knowledge in wellbeing, relaxation, skin biology-anatomy, aromatherapy and more...
                  <br /><br />
                  Passionate and love the moment when my client and I see the positive difference on their skin, nails or body, being able to consult them and feel the gratitude and appreciation is the BEST moment.
                  <br /><br />
                  Beauty to me is natural, and to embrace every single expression wrinkle.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={inView1 ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      boxShadow: "0 20px 40px rgba(212, 165, 116, 0.3)",
                      transition: { duration: 0.3 }
                    }}
                    className="bg-light text-center p-6 rounded-xl shadow-lg cursor-pointer"
                  >
                    <motion.div
                      animate={inView1 ? { rotate: [0, 10, -10, 0] } : {}}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    >
                      <FaCalendarAlt className="text-5xl text-primary mx-auto mb-3" />
                    </motion.div>
                    <h2 className="text-5xl font-bold text-dark mb-2">26</h2>
                    <p className="text-dark font-semibold uppercase">Years Experience</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
                    animate={inView1 ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.9, duration: 0.6, type: "spring" }}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: -5,
                      boxShadow: "0 20px 40px rgba(212, 165, 116, 0.3)",
                      transition: { duration: 0.3 }
                    }}
                    className="bg-light text-center p-6 rounded-xl shadow-lg cursor-pointer"
                  >
                    <motion.div
                      animate={inView1 ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ delay: 1.3, duration: 0.5 }}
                    >
                      <FaUsers className="text-5xl text-primary mx-auto mb-3" />
                    </motion.div>
                    <h2 className="text-5xl font-bold text-dark mb-2">2500+</h2>
                    <p className="text-dark font-semibold uppercase">Happy Customers</p>
                  </motion.div>
                </div>

                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-dark px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-dark hover:text-primary transition-all duration-300 shadow-lg mt-6"
                  >
                    {t('common.readMore') || 'Read More'}
                  </motion.button>
                </Link>
                </motion.div>
              </MediumParallaxLayer>
            </div>
          </div>
        </section>

        {/* Decorative Divider */}
        <DecorativeDivider variant="dots" className="-my-4" />

        {/* Services Section */}
        <section id="services-section" ref={ref2} className="w-full section-padding bg-light relative">
          <div className="container-custom max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {servicesData.slice(0, 6).map((service, index) => {
                const nameKey = `services.service${service.id}.name`
                const descKey = `services.service${service.id}.description`
                const serviceName = t(nameKey) !== nameKey ? t(nameKey) : service.name
                const serviceDesc = t(descKey) !== descKey ? t(descKey) : service.description
                return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={inView2 ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.04,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  className="service-card p-6 text-center group relative overflow-hidden"
                >
                  <div className="image-hover-zoom w-16 h-16 md:w-20 md:h-20 mx-auto mb-4">
                    <img src={service.image} alt={serviceName} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="font-playfair text-lg md:text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors tracking-wide">
                    {serviceName}
                  </h3>
                  <p className="text-gray-600 mb-3 text-xs md:text-sm leading-relaxed line-clamp-2">{serviceDesc}</p>
                  <Link href="/pricelist" className="link-underline">
                    <button className="text-primary font-semibold uppercase text-sm hover:text-dark transition-colors flex items-center gap-2 mx-auto group-hover:gap-4 transition-all">
                      {t('common.readMore')} <FaArrowRight />
                    </button>
                  </Link>
                </motion.div>
              )})}
            </div>
          </div>
        </section>

        {/* Pricing Preview Section with Parallax */}
        <div ref={ref3}>
          <PromotionalParallaxSection promotionsData={promotionsData} inView={inView3} />
        </div>

        {/* Decorative Divider */}
        <DecorativeDivider variant="line" />

        {/* Gallery Preview with Individual Parallax */}
        <section ref={ref4} className="w-full section-padding bg-white relative">
          <div className="container-custom max-w-7xl">
            <SectionTitle subtitle="Gallery" title="Explore Our Gallery" />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
              {galleryData.slice(0, 6).map((item, index) => {
                // Different parallax speeds for each row
                const rowIndex = Math.floor(index / 3)
                const parallaxSpeed = rowIndex === 0 ? 0.1 : rowIndex === 1 ? 0.2 : 0.3
                
                return (
                  <ParallaxLayer
                    key={item.id}
                    speed={parallaxSpeed}
                    mobileSpeed={parallaxSpeed * 0.5}
                    className="relative group overflow-hidden aspect-square cursor-pointer rounded-lg"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      className="relative w-full h-full"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        <div className="text-white">
                          <h4 className="font-playfair text-xl font-bold mb-1">{item.title}</h4>
                          <p className="text-primary uppercase text-xs">{item.category}</p>
                        </div>
                      </div>
                    </motion.div>
                  </ParallaxLayer>
                )
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/gallery">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-dark px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-dark hover:text-primary transition-all duration-300 shadow-lg"
                >
                  View Full Gallery
                </motion.button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Preview */}
        <section className="w-full section-padding bg-light">
          <div className="container-custom max-w-7xl">
            <SectionTitle subtitle="Testimonial" title="What Clients Say!" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {testimonialsData.slice(0, 3).map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass p-6 rounded-2xl text-center glass-hover group"
                >
                  <FaQuoteLeft className="text-4xl text-primary/20 mx-auto mb-4 floating" />
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + i * 0.1 }}
                      >
                        <FaStar className="text-primary text-sm" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 text-sm md:text-base italic leading-relaxed whitespace-pre-line">{testimonial.text}</p>
                  <motion.img
                    src={testimonial.image}
                    alt={testimonial.name}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-primary object-cover shadow-glow"
                  />
                  <h4 className="font-playfair text-lg font-bold text-dark tracking-wide">{testimonial.name}</h4>
                  {testimonial.role && <p className="text-primary text-xs uppercase tracking-wider mt-1">{testimonial.role}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
  )
}


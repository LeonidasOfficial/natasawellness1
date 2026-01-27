'use client'

import ScrollToTop from '@/components/ui/ScrollToTop'
import SectionTitle from '@/components/ui/SectionTitle'
import { motion } from 'framer-motion'
import { FaQuoteLeft, FaStar } from 'react-icons/fa'
import testimonialsData from '@/data/testimonials.json'

export default function TestimonialsPage() {
  return (
    <>
      <section className="relative bg-light py-12 md:py-16">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-4xl md:text-6xl font-bold text-dark">
            Testimonials
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-7xl">
          <SectionTitle subtitle="Reviews" title="What Our Clients Say!" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {testimonialsData.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass p-6 rounded-2xl text-center glass-hover group"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FaQuoteLeft className="text-4xl md:text-5xl text-primary/20 mx-auto mb-4" />
                </motion.div>
                
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.1, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.3, rotate: 15 }}
                    >
                      <FaStar className="text-primary text-sm md:text-base" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-gray-600 mb-4 text-sm md:text-base italic leading-relaxed">
                  "{testimonial.text}"
                </p>

                <motion.img
                  src={testimonial.image}
                  alt={testimonial.name}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-primary object-cover shadow-glow"
                />

                <h4 className="font-playfair text-lg font-bold text-dark mb-1 tracking-wide">
                  {testimonial.name}
                </h4>
                <p className="text-primary text-xs uppercase tracking-wider">
                  {testimonial.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </>
  )
}


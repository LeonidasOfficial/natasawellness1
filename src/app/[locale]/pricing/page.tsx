'use client'

import ScrollToTop from '@/components/ui/ScrollToTop'
import SectionTitle from '@/components/ui/SectionTitle'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaCheck } from 'react-icons/fa'
import servicesData from '@/data/services.json'

export default function PricingPage() {
  return (
    <>
      <section className="relative bg-light py-20">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-5xl md:text-7xl font-bold text-dark">
            Pricing
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle subtitle="Our Prices" title="Transparent & Affordable Pricing" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-light rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md">
                  <img src={service.image} alt={service.name} className="w-16 h-16 object-contain" />
                </div>

                <h3 className="font-playfair text-2xl font-bold text-dark mb-2">
                  {service.name}
                </h3>

                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="text-5xl font-bold text-primary mb-6">
                  ${service.price}
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FaCheck className="text-primary" />
                    <span>Duration: {service.duration}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FaCheck className="text-primary" />
                    <span>Premium Products</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FaCheck className="text-primary" />
                    <span>Expert Specialists</span>
                  </div>
                </div>

                <Link href="/booking">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-primary text-dark py-3 rounded-full font-bold hover:bg-dark hover:text-primary transition-all"
                  >
                    Book Now
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </>
  )
}


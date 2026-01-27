'use client'

import ScrollToTop from '@/components/ui/ScrollToTop'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaUsers, FaAward, FaHeart } from 'react-icons/fa'

export default function AboutPage() {
  const features = [
    { icon: FaCalendarAlt, title: '25+ Years', desc: 'Experience' },
    { icon: FaUsers, title: '999+', desc: 'Happy Clients' },
    { icon: FaAward, title: '50+', desc: 'Awards Won' },
    { icon: FaHeart, title: '100%', desc: 'Satisfaction' }
  ]

  return (
    <>
      <section className="relative bg-light py-12 md:py-16">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-4xl md:text-6xl font-bold text-dark">
            About Us
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center mb-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="/img/about.jpg" alt="About Salone" className="rounded-2xl shadow-2xl" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
              <h2 className="font-dancing text-4xl md:text-5xl text-primary">Our Story</h2>
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-dark">Excellence in Beauty Since 1999</h1>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Salone began with a simple dream: to create a sanctuary where beauty meets artistry. 
                For over 25 years, we've been transforming lives through our exceptional services and 
                unwavering commitment to excellence.
              </p>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Our team of expert stylists, beauticians, and wellness professionals are passionate 
                about making you look and feel your absolute best. We use only premium products and 
                stay ahead of the latest trends to ensure you receive world-class service every visit.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-light p-6 rounded-xl text-center shadow-lg cursor-pointer"
              >
                <feature.icon className="text-4xl md:text-5xl text-primary mx-auto mb-3" />
                <h3 className="text-2xl md:text-3xl font-bold text-dark mb-1">{feature.title}</h3>
                <p className="text-gray-600 font-semibold text-sm md:text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </>
  )
}


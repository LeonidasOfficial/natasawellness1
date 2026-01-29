'use client'

import ScrollToTop from '@/components/ui/ScrollToTop'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaUsers, FaHeart } from 'react-icons/fa'

export default function AboutPage() {
  const features = [
    { icon: FaCalendarAlt, title: '26 Years', desc: 'Experience' },
    { icon: FaUsers, title: '2500+', desc: 'Happy Clients' },
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
              <img src="/img/about.png" alt="About Salone" className="rounded-2xl shadow-2xl" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
              <h2 className="font-dancing text-4xl md:text-5xl text-primary">Our Story</h2>
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-dark">Excellence in Beauty Since 2000</h1>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                My journey in the world of beauty started in the year 2000, passionate in make-up and wanting to be a make-up artist not knowing how enormous the variety in the beauty profession would be. During my apprenticeship I loved more and more everything about cosmetics and all the different treatments such as facials, epilation and nails which interested me most. Received my diploma 2004 in Luxembourg. 2016 I completed and received my Spa Manager diploma in Spain, expanding my knowledge in wellbeing, relaxation, skin biology-anatomy, aromatherapy and more...
              </p>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Passionate and love the moment when my client and I see the positive difference on their skin, nails or body, being able to consult them and feel the gratitude and appreciation is the BEST moment.
                <br /><br />
                Beauty to me is natural, and to embrace every single expression wrinkle.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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


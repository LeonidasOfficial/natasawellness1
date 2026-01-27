'use client'

import ScrollToTop from '@/components/ui/ScrollToTop'
import SectionTitle from '@/components/ui/SectionTitle'
import { motion } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import teamData from '@/data/team.json'

export default function TeamPage() {
  return (
    <>
      <section className="relative bg-light py-20">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-5xl md:text-7xl font-bold text-dark">
            Our Team
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle subtitle="Meet The Team" title="Our Expert Specialists" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamData.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-2xl shadow-lg"
              >
                <div className="image-hover-zoom aspect-[3/4]">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>

                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-primary text-sm font-semibold uppercase mb-1">{member.role}</p>
                  <h4 className="font-playfair text-2xl font-bold text-dark mb-3">{member.name}</h4>
                  <p className="text-gray-600 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {member.bio}
                  </p>
                  
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <motion.a
                      href={member.social.facebook}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="w-10 h-10 bg-dark text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-dark transition-colors"
                    >
                      <FaFacebookF />
                    </motion.a>
                    <motion.a
                      href={member.social.instagram}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="w-10 h-10 bg-dark text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-dark transition-colors"
                    >
                      <FaInstagram />
                    </motion.a>
                    <motion.a
                      href={member.social.linkedin}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="w-10 h-10 bg-dark text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-dark transition-colors"
                    >
                      <FaLinkedinIn />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </>
  )
}


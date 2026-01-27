'use client'

import ScrollToTop from '@/components/ui/ScrollToTop'
import SectionTitle from '@/components/ui/SectionTitle'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaCalendarAlt, FaFolder, FaArrowRight } from 'react-icons/fa'
import blogData from '@/data/blog.json'

export default function BlogPage() {
  return (
    <>
      <section className="relative bg-light py-20">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-5xl md:text-7xl font-bold text-dark">
            Beauty Blog
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle subtitle="Our Blog" title="Latest Beauty Tips & Trends" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogData.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-light rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="image-hover-zoom h-64">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-primary" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaFolder className="text-primary" />
                      {post.category}
                    </span>
                  </div>

                  <h3 className="font-playfair text-2xl font-bold text-dark mb-4 hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-6">{post.excerpt}</p>

                  <button className="text-primary font-semibold uppercase text-sm hover:text-dark transition-colors flex items-center gap-2 group">
                    Read More <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </>
  )
}


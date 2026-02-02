'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FaCut, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaTwitter,
  FaPaperPlane,
  FaHeart
} from 'react-icons/fa'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLocaleLink } from '@/hooks/useLocaleLink'
import { useTranslation } from '@/contexts/TranslationContext'

const Footer = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const { createLink } = useLocaleLink()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)

    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to our newsletter!')
      setEmail('')
      setIsSubscribing(false)
    }, 1000)
  }

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Book Appointment', path: '/booking' },
  ]

  const socialLinks = [
    { name: 'twitter', url: 'https://twitter.com', color: 'hover:text-blue-400' },
    { name: 'facebook', url: 'https://facebook.com', color: 'hover:text-blue-600' },
    { name: 'linkedin', url: 'https://linkedin.com', color: 'hover:text-blue-500' },
    { name: 'instagram', url: 'https://instagram.com', color: 'hover:text-pink-500' },
  ]

  const getSocialIcon = (name: string) => {
    switch (name) {
      case 'twitter':
        return <FaTwitter className="text-lg" />
      case 'facebook':
        return <FaFacebookF className="text-lg" />
      case 'linkedin':
        return <FaLinkedinIn className="text-lg" />
      case 'instagram':
        return <FaInstagram className="text-lg" />
      default:
        return null
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <footer className="w-full bg-dark text-white-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container-custom py-20 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Left Column - About */}
          <motion.div variants={itemVariants} className="space-y-3 md:space-y-4">
            <Link href={createLink('/')} className="inline-flex items-center gap-2 md:gap-3 group">
              <FaCut className="text-primary text-3xl md:text-4xl group-hover:rotate-12 transition-transform duration-300" />
              <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-primary">Nataša Wellness</h2>
            </Link>

            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              Opustite telo, smirite um, obnovite duh. Nataša Wellness nudi profesionalne kozmetičke i 
              wellness tretmane sa preko 25 godina iskustva. Personalizovana nega i pažnja posvećena vama.
            </p>

            <div className="space-y-2 md:space-y-3">
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start md:items-center gap-2 md:gap-3 text-gray-300 hover:text-primary transition-colors cursor-pointer"
              >
                <FaMapMarkerAlt className="text-primary text-lg md:text-xl flex-shrink-0 mt-1 md:mt-0" />
                <span className="text-sm md:text-base break-words">12 Mileta Arčića Pačinog, Velika Plana</span>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-center gap-2 md:gap-3 text-gray-300 hover:text-primary transition-colors cursor-pointer"
              >
                <FaPhoneAlt className="text-primary text-lg md:text-xl flex-shrink-0" />
                <span className="text-sm md:text-base">063 1020 305</span>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-center gap-2 md:gap-3 text-gray-300 hover:text-primary transition-colors cursor-pointer"
              >
                <FaEnvelope className="text-primary text-lg md:text-xl flex-shrink-0" />
                <span className="text-sm md:text-base break-all">info@natasawellness.com</span>
              </motion.div>
            </div>

            <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center text-dark ${social.color} transition-all duration-400 shadow-glow hover:shadow-glow-lg`}
                >
                  {getSocialIcon(social.name)}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Links & Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4 md:space-y-6">
            {/* Quick Links */}
            <div>
              <h5 className="text-primary font-playfair text-lg md:text-xl font-semibold mb-3 md:mb-4">Quick Links</h5>
              <ul className="space-y-1 md:space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.path}
                      className="text-gray-300 hover:text-primary transition-colors duration-400 flex items-center gap-2 group text-sm md:text-base link-underline"
                    >
                      <motion.span 
                        className="text-primary"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        ›
                      </motion.span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="text-primary font-playfair text-lg md:text-xl font-semibold mb-3 md:mb-4">Newsletter</h5>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2 md:space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    required
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg px-4 md:px-6 py-3 md:py-4 pr-12 md:pr-14 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors text-sm md:text-base"
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubscribing}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-dark p-2 md:p-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    aria-label="Subscribe to newsletter"
                  >
                    <FaPaperPlane className="text-lg md:text-xl" />
                  </motion.button>
                </div>
                <p className="text-gray-400 text-xs md:text-sm">
                  Subscribe to get special offers and beauty tips!
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Copyright Bar */}
      <div className="w-full border-t border-gray-800 py-6 relative z-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm text-center md:text-left"
            >
              © {new Date().getFullYear()} <Link href={createLink('/')} className="text-primary hover:underline">Nataša Wellness</Link>. Sva prava zadržana.
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm flex items-center gap-2"
            >
              Napravljeno sa <FaHeart className="text-primary animate-pulse" /> od Danilo Peric
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


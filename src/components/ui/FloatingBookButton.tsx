'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaTimes } from 'react-icons/fa'
import siteConfig from '@/data/site-config.json'

const FloatingSocialButtons = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 500 && !isDismissed) {
        setIsVisible(true)
      } else if (window.pageYOffset <= 500) {
        setIsVisible(false)
        setIsDismissed(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDismissed(true)
    setIsVisible(false)
  }

  const socialLinks = [
    { 
      icon: FaFacebookF, 
      url: siteConfig.social.facebook, 
      color: 'hover:text-blue-600',
      label: 'Facebook'
    },
    { 
      icon: FaInstagram, 
      url: siteConfig.social.instagram, 
      color: 'hover:text-pink-500',
      label: 'Instagram'
    },
    { 
      icon: FaInstagram, 
      url: siteConfig.social.tiktok, 
      color: 'hover:text-black',
      label: 'TikTok',
      isTikTok: true
    },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="fixed left-8 bottom-24 z-40 group"
        >
          <div className="flex flex-col gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary via-primary-light to-primary text-dark rounded-full shadow-2xl flex items-center justify-center w-14 h-14 hover:shadow-primary/50 transition-all duration-300"
                aria-label={social.label}
              >
                {social.isTikTok ? (
                  <svg className={`text-2xl transition-colors ${social.color}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                ) : (
                  <social.icon className={`text-2xl transition-colors ${social.color}`} />
                )}
              </motion.a>
            ))}
          </div>
          
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-dark text-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-dark"
          >
            <FaTimes className="text-xs" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FloatingSocialButtons


'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaBars, FaTimes } from 'react-icons/fa'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useLocaleLink } from '@/hooks/useLocaleLink'
import { useTranslation } from '@/contexts/TranslationContext'
import siteConfig from '@/data/site-config.json'

const Navbar = () => {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { createLink } = useLocaleLink()
  const normalizePath = (path: string) => {
    if (!path) return '/'
    if (path === '/') return '/'
    return path.replace(/\/+$/, '')
  }

  const normalizedPathname = normalizePath(pathname)
  const getLocalizedPath = (targetPath: string) => normalizePath(createLink(targetPath))
  const isActivePath = (targetPath: string) => normalizedPathname === getLocalizedPath(targetPath)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  interface NavLink {
    name: string
    path: string
    highlight?: boolean
  }

  const navLinks: NavLink[] = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    // { name: t('nav.services'), path: '/services' }, // Disabled - can be re-enabled in the future
    { name: t('nav.priceList'), path: '/pricelist' },
    { name: t('nav.contact'), path: '/contact' },
    // { name: t('nav.bookNow'), path: '/booking', highlight: true }, // Disabled - booking removed
  ]

  const socialLinks = [
    { 
      icon: FaFacebookF, 
      url: siteConfig.social.facebook,
      label: 'Facebook',
      color: 'hover:text-blue-600'
    },
    { 
      icon: FaInstagram, 
      url: siteConfig.social.instagram,
      label: 'Instagram',
      color: 'hover:text-pink-500'
    },
    { 
      icon: FaInstagram, // Will be replaced with TikTok SVG
      url: siteConfig.social.tiktok,
      label: 'TikTok',
      color: 'hover:text-black',
      isTikTok: true
    },
  ]

  return (
    <>
      {/* Announcement Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-gradient-to-r from-primary via-primary-light to-primary text-dark py-2 px-4 text-center text-xs md:text-sm font-semibold"
      >
        <p className="truncate">✨ {t('announcement.message')} ✨</p>
      </motion.div>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full sticky top-0 z-50 bg-light transition-all duration-500 ${
          isScrolled ? 'shadow-xl' : ''
        }`}
      >
        <div className="w-full">
          <div className="flex items-center justify-between max-w-full">
            {/* Logo */}
            <Link href={createLink('/')} className="flex items-center gap-2 bg-primary py-4 px-4 md:py-6 md:px-8 hover:bg-primary-dark transition-colors duration-300 flex-shrink-0">
              <img src="/img/admin-ajax.png" alt="Nataša Wellness" className="h-8 md:h-9 w-auto" />
              <h1 className="font-playfair text-xl md:text-2xl lg:text-3xl font-bold text-dark whitespace-nowrap">Nataša Wellness</h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {navLinks.map((link) => {
                const linkIsActive = isActivePath(link.path)

                return (
                  <div key={link.name} className="relative group">
                    {link.highlight ? (
                      <Link
                        href={createLink(link.path)}
                        className="bg-primary text-dark px-6 py-3 rounded-full font-semibold hover:bg-dark hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <Link
                        href={createLink(link.path)}
                        className={`font-playfair text-lg font-medium uppercase tracking-wider transition-colors duration-400 relative link-underline ${
                          linkIsActive ? 'text-primary' : 'text-dark hover:text-primary'
                        }`}
                      >
                        {link.name}
                        {linkIsActive && (
                          <motion.div
                            layoutId="navbar-indicator"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                            initial={false}
                          />
                        )}
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Language Switcher & Social Links - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />
              
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.3, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center text-dark hover:bg-dark hover:text-primary transition-all duration-400 shadow-glow hover:shadow-glow-lg ${social.color}`}
                    aria-label={social.label}
                  >
                    {social.isTikTok ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    ) : (
                      <social.icon />
                    )}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-dark text-2xl p-4 hover:text-primary transition-colors flex-shrink-0"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white border-t border-primary"
            >
              <div className="container-custom py-6">
                {navLinks.map((link) => (
                  <div key={link.name} className="mb-4">
                    <Link
                      href={createLink(link.path)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block font-playfair text-lg font-medium py-2 ${
                        isActivePath(link.path) ? 'text-primary' : 'text-dark'
                      } ${link.highlight ? 'bg-primary text-dark px-4 py-3 rounded-lg' : ''}`}
                    >
                      {link.name}
                    </Link>
                  </div>
                ))}

                {/* Language Switcher - Mobile */}
                <div className="mt-6 pt-6 border-t border-primary/20">
                  <div className="flex items-center justify-center">
                    <LanguageSwitcher />
                  </div>
                </div>

                {/* Social Links - Mobile */}
                <div className="flex items-center gap-3 mt-6 justify-center">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center text-dark hover:bg-dark hover:text-primary transition-all duration-400 shadow-glow hover:shadow-glow-lg ${social.color}`}
                      aria-label={social.label}
                    >
                      {social.isTikTok ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      ) : (
                        <social.icon />
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar

'use client'

import { useState } from 'react'
import ScrollToTop from '@/components/ui/ScrollToTop'
import WorkingHoursCard from '@/components/ui/WorkingHoursCard'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa'
import { useTranslation } from '@/contexts/TranslationContext'

export default function ContactPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error(t('contactPage.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section className="relative bg-light py-12 md:py-16">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-4xl md:text-6xl font-bold text-dark mb-4">
            {t('contactPage.title')}
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <h2 className="font-dancing text-3xl md:text-4xl text-primary mb-2">{t('contactPage.getInTouch')}</h2>
                <h1 className="font-playfair text-3xl md:text-4xl font-bold text-dark mb-4">{t('contactPage.visitSalon')}</h1>
                <p className="text-gray-600 text-base md:text-lg">{t('contactPage.description')}</p>
              </div>

              {[
                { icon: FaMapMarkerAlt, title: t('contactPage.locationTitle'), text: '12 Mileta Arčića Pačinog, Velika Plana' },
                { icon: FaPhone, title: t('contactPage.callTitle'), text: '063 1020 305' },
                { icon: FaEnvelope, title: t('contactPage.emailTitle'), text: 'info@natasawellness.com' }
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ x: 10 }} className="flex items-start gap-3 p-5 bg-light rounded-xl hover:shadow-lg transition-all">
                  <item.icon className="text-2xl md:text-3xl text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-dark text-base md:text-lg mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm md:text-base">{item.text}</p>
                  </div>
                </motion.div>
              ))}

              {/* Working Hours Card */}
              <WorkingHoursCard />
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-light rounded-2xl p-6 md:p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder={t('contactPage.form.name')} className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none" />
                <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder={t('contactPage.form.email')} className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none" />
                <input type="text" name="subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required placeholder={t('contactPage.form.subject')} className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none" />
                <textarea name="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required rows={6} placeholder={t('contactPage.form.message')} className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none resize-none" />
                
                <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full bg-primary text-dark px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-dark hover:text-primary transition-all disabled:opacity-50">
                  {isSubmitting ? t('contactPage.form.sending') : t('contactPage.form.send')} <FaPaperPlane />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </>
  )
}


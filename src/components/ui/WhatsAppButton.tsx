'use client'

import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { useState } from 'react'

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Nataša Wellness phone number from the site
  const phoneNumber = '381631020305' // Format: country code + number without +
  const message = encodeURIComponent('Hello! I would like to book an appointment.')

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-40 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 transition-all duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FaWhatsapp className="text-white text-3xl" />
      
      {/* Pulse Effect */}
      <motion.span
        className="absolute inset-0 rounded-full bg-green-500"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
        className="absolute right-full mr-3 bg-dark text-white px-4 py-2 rounded-lg whitespace-nowrap shadow-xl"
      >
        <span className="font-semibold">Chat on WhatsApp</span>
        <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-dark border-b-8 border-b-transparent" />
      </motion.div>
    </motion.a>
  )
}

export default WhatsAppButton


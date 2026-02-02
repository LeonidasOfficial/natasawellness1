'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ParallaxLayer from './ParallaxLayer'

interface SectionTitleProps {
  subtitle: string
  title: string
  centered?: boolean
  light?: boolean
}

const SectionTitle = ({ subtitle, title, centered = true, light = false }: SectionTitleProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-6 md:mb-8 ${centered ? 'text-center' : ''}`}
    >
      {/* Subtitle with faster parallax */}
      <ParallaxLayer speed={0.5} mobileSpeed={0.25}>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`font-dancing text-4xl md:text-5xl mb-2 tracking-wide ${light ? 'text-white' : 'text-primary'}`}
        >
          {subtitle}
        </motion.h2>
      </ParallaxLayer>
      
      {/* Title with slower parallax */}
      <ParallaxLayer speed={0.3} mobileSpeed={0.15}>
        <motion.h1 
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`font-playfair text-3xl md:text-5xl font-bold tracking-wide ${light ? 'text-white' : 'text-dark'}`}
        >
          {title}
        </motion.h1>
      </ParallaxLayer>
    </motion.div>
  )
}

export default SectionTitle


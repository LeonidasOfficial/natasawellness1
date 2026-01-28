'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ParallaxLayer from './ParallaxLayer'

interface DecorativeDividerProps {
  className?: string
  variant?: 'wave' | 'line' | 'dots'
  color?: string
}

export default function DecorativeDivider({
  className = '',
  variant = 'wave',
  color = '#D4A574',
}: DecorativeDividerProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
  }, [])

  if (variant === 'wave') {
    return (
      <ParallaxLayer speed={0.3} className={className}>
        <motion.svg
          width="100%"
          height="60"
          viewBox="0 0 1200 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <motion.path
            d="M0,30 Q300,10 600,30 T1200,30"
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.3"
            fill="none"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    d: [
                      'M0,30 Q300,10 600,30 T1200,30',
                      'M0,30 Q300,20 600,30 T1200,30',
                      'M0,30 Q300,10 600,30 T1200,30',
                    ],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.svg>
      </ParallaxLayer>
    )
  }

  if (variant === 'line') {
    return (
      <ParallaxLayer speed={0.2} className={className}>
        <div className="relative h-px w-full overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: color, opacity: 0.2 }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </ParallaxLayer>
    )
  }

  if (variant === 'dots') {
    return (
      <ParallaxLayer speed={0.25} className={className}>
        <div className="flex justify-center items-center gap-4 py-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color, opacity: 0.3 }}
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [0, -8, 0],
                      scale: [1, 1.2, 1],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </ParallaxLayer>
    )
  }

  return null
}

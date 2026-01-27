'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ReactNode } from 'react'

interface ParallaxLayerProps {
  children: ReactNode
  speed?: number // -1 to 1, negative = slower, positive = faster
  direction?: 'vertical' | 'horizontal'
  className?: string
  offset?: [number, number] // [start, end] for scroll progress
  mobileSpeed?: number // Reduced speed for mobile
}

export default function ParallaxLayer({
  children,
  speed = 0.5,
  direction = 'vertical',
  className = '',
  offset = [0, 1],
  mobileSpeed,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )
      setIsMobile(window.innerWidth < 768)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Mobile detection and speed adjustment
  const finalSpeed = isMobile && mobileSpeed !== undefined ? mobileSpeed : speed

  // Calculate transform value
  const transformValue = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion
      ? [0, 0]
      : direction === 'vertical'
      ? [0, finalSpeed * 150]
      : [0, finalSpeed * 100]
  )

  const y = direction === 'vertical' ? transformValue : 0
  const x = direction === 'horizontal' ? transformValue : 0

  return (
    <motion.div
      ref={ref}
      style={{
        y: prefersReducedMotion ? 0 : y,
        x: prefersReducedMotion ? 0 : x,
        willChange: prefersReducedMotion ? 'auto' : 'transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Fast parallax layer (for decorative elements)
export function FastParallaxLayer({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <ParallaxLayer speed={0.8} className={className} mobileSpeed={0.4}>
      {children}
    </ParallaxLayer>
  )
}

// Slow parallax layer (for backgrounds)
export function SlowParallaxLayer({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <ParallaxLayer speed={0.2} className={className} mobileSpeed={0.1}>
      {children}
    </ParallaxLayer>
  )
}

// Medium parallax layer (for content)
export function MediumParallaxLayer({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <ParallaxLayer speed={0.4} className={className} mobileSpeed={0.2}>
      {children}
    </ParallaxLayer>
  )
}

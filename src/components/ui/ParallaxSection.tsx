'use client'

import { Parallax } from 'react-parallax'
import { ReactNode } from 'react'

interface ParallaxSectionProps {
  bgImage: string
  strength?: number
  blur?: number
  children: ReactNode
  className?: string
  bgClassName?: string
}

const ParallaxSection = ({ 
  bgImage, 
  strength = 300, 
  blur = 0,
  children, 
  className = '',
  bgClassName = ''
}: ParallaxSectionProps) => {
  return (
    <Parallax
      bgImage={bgImage}
      strength={strength}
      blur={{ min: -blur, max: blur }}
      bgStyle={{
        objectFit: 'cover'
      }}
      className={className}
    >
      <div className={bgClassName} style={{ minHeight: '400px' }}>
        {children}
      </div>
    </Parallax>
  )
}

export default ParallaxSection


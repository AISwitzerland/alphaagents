'use client'

import { useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  glareColor?: string
}

export function TiltCard({ children, className, glareColor = 'cyan' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = width / 2
    const centerY = height / 2

    const rotateXValue = ((y - centerY) / centerY) * -10
    const rotateYValue = ((x - centerX) / centerX) * 10

    rotateX.set(rotateXValue)
    rotateY.set(rotateYValue)
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    rotateX.set(0)
    rotateY.set(0)
  }

  const glareBackground = useMotionTemplate`
    radial-gradient(
      300px circle at ${mouseX}px ${mouseY}px,
      rgba(0, 212, 255, 0.15),
      transparent 80%
    )
  `

  return (
    <motion.div
      ref={ref}
      className={cn(
        'relative rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden',
        'transform-gpu perspective-1000',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glare Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          background: glareBackground,
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Border Glow on Hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: isHovered 
            ? '0 0 30px rgba(0, 212, 255, 0.2), inset 0 0 30px rgba(0, 212, 255, 0.05)'
            : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      />

      {/* Content */}
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  )
}


'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export function ParticlesBackground({ count = 50 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      })
    }
    setParticles(newParticles)
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyan-400/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export function ConnectedDots() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const dots = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
      {/* Connection Lines */}
      {dots.map((dot, i) => 
        dots.slice(i + 1).map((otherDot, j) => {
          const distance = Math.sqrt(
            Math.pow(dot.x - otherDot.x, 2) + Math.pow(dot.y - otherDot.y, 2)
          )
          if (distance < 30) {
            return (
              <motion.line
                key={`${i}-${j}`}
                x1={`${dot.x}%`}
                y1={`${dot.y}%`}
                x2={`${otherDot.x}%`}
                y2={`${otherDot.y}%`}
                stroke="rgba(0, 212, 255, 0.3)"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.1 }}
              />
            )
          }
          return null
        })
      )}
      
      {/* Dots */}
      {dots.map((dot) => (
        <motion.circle
          key={dot.id}
          cx={`${dot.x}%`}
          cy={`${dot.y}%`}
          r="2"
          fill="rgba(0, 212, 255, 0.5)"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: dot.id * 0.1,
          }}
        />
      ))}
    </svg>
  )
}


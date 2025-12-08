'use client'

import { motion } from 'framer-motion'

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/10 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: '10%', left: '5%' }}
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-purple-500/10 to-cyan-500/10 blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: '50%', right: '10%' }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-cyan-400/15 to-transparent blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: '20%', left: '30%' }}
      />

      {/* Floating 3D Shapes */}
      <motion.div
        className="absolute w-20 h-20"
        animate={{
          y: [0, -20, 0],
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ top: '20%', right: '20%' }}
      >
        <div className="w-full h-full border border-cyan-500/30 rounded-lg transform rotate-45 backdrop-blur-sm" />
      </motion.div>

      <motion.div
        className="absolute w-16 h-16"
        animate={{
          y: [0, 30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: '60%', left: '15%' }}
      >
        <div className="w-full h-full border border-cyan-500/20 rounded-full" />
      </motion.div>

      <motion.div
        className="absolute w-12 h-12"
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: '40%', right: '30%' }}
      >
        <div className="w-full h-full border-2 border-cyan-400/25 transform rotate-12" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      </motion.div>
    </div>
  )
}

export function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
    </div>
  )
}


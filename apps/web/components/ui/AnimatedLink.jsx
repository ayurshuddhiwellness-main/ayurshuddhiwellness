'use client'

import { motion } from 'framer-motion'
import { EASE } from './motion'

// Restrained pill / link micro-interaction: a barely-there scale on hover,
// a small inward press on tap, and an optional arrow that nudges right.
// No shadow growth, no glow. Reduced-motion is handled globally by
// MotionConfig (transforms are dropped, leaving these as no-ops).
const scaleVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
}

const staticVariants = {
  rest: { scale: 1 },
  hover: { scale: 1 },
  tap: { scale: 1 },
}

const arrowVariants = {
  rest: { x: 0 },
  hover: { x: 3 },
}

export default function AnimatedLink({
  href,
  children,
  className,
  arrow = false,
  scale = true,
  onClick,
}) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      className={className}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      variants={scale ? scaleVariants : staticVariants}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {children}
      {arrow && (
        <motion.span
          aria-hidden="true"
          className="ml-1.5 inline-block"
          variants={arrowVariants}
          transition={{ duration: 0.25, ease: EASE }}
        >
          →
        </motion.span>
      )}
    </motion.a>
  )
}

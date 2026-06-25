'use client'

import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from './motion'

// Wrap a sequence of RevealItems. Stagger-reveals them once, on scroll into
// view, and never re-triggers on scroll back up.
export function RevealGroup({ children, className }) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {children}
    </motion.div>
  )
}

// A single staggered child (eyebrow / headline / body / button / card).
export function RevealItem({ children, className }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}

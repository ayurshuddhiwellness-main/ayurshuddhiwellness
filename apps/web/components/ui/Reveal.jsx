'use client'

import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from './motion'

// Wrap a sequence of RevealItems and stagger-reveal them once.
// trigger="view" (default): reveals on scroll into view — for marketing sections.
// trigger="mount": reveals immediately on load — for primary content (e.g. an
// article body) that must be visible even when it sits below the fold.
export function RevealGroup({ children, className, trigger = 'view' }) {
  const triggerProps =
    trigger === 'mount'
      ? { animate: 'visible' }
      : { whileInView: 'visible', viewport: { once: true, margin: '-100px' } }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      {...triggerProps}
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

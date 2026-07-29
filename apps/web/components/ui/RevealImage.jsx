'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { EASE } from './motion'

/* Editorial image reveal: a linen panel retracts upward off the frame while the
   photograph settles out of a slight overscale. One gesture in two parts.

   The photograph only ever scales — it never translates against the scroll — so
   this reads as a reveal rather than parallax, which the UX guidance flags as a
   motion-sickness trigger. Both keys are transforms, so reduced motion snaps
   them to their targets and the frame still clears. */
export default function RevealImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  reduce = false,
}) {
  const viewport = { once: true, margin: '-80px' }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-card ${className ?? ''}`}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={viewport}
        transition={reduce ? { duration: 0 } : { duration: 1.5, ease: EASE }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
        />
      </motion.div>

      {/* Retracting panel — collapses into its own top edge, uncovering the
          frame from the bottom up so it travels with the copy beneath it. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 origin-top bg-background"
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={viewport}
        transition={reduce ? { duration: 0 } : { duration: 1.05, ease: EASE }}
      />
    </div>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE } from './motion'

/* Type that rises out of its own clip box — the About page's signature reveal.
   The box carries extra bottom padding, then pulls it back with a matching
   negative margin, so Cormorant's descenders aren't shaved by overflow-hidden.

   Reduced motion needs no structural branch here: framer routes transform keys
   through `{ type: false }` when the user prefers reduced motion, which snaps
   them to their target instead of tweening — so the line lands visible on its
   own. `reduce` only zeroes the timing, because delays are not gated that way. */
export default function MaskReveal({
  children,
  className,
  delay = 0,
  duration = 0.9,
  trigger = 'view',
  play = true,
  reduce = false,
}) {
  // Watched on the clip box, not the line: the line starts translated a full
  // 112% below its box, so it is the wrong thing to test for intersection.
  const boxRef = useRef(null)
  const inView = useInView(boxRef, { once: true, margin: '-80px' })

  // `play` only applies to the mount trigger — it lets a caller hold the line
  // down until something else is ready (the /about splash lifting, say).
  //
  // This must resolve to an explicit `animate` rather than `whileInView`.
  // Framer propagates a parent's variant label to any motion child that has no
  // `animate` of its own, so inside a variant tree (a RevealItem, say) the
  // parent's label won out and the line stayed pinned below its clip box.
  const open = trigger === 'mount' ? play : inView

  return (
    <span
      ref={boxRef}
      className="-mb-[0.16em] block overflow-hidden pb-[0.16em]"
    >
      <motion.span
        className={`block ${className ?? ''}`}
        initial={{ y: '112%' }}
        animate={{ y: open ? '0%' : '112%' }}
        transition={reduce ? { duration: 0 } : { duration, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

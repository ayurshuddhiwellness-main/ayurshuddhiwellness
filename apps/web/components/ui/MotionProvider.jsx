'use client'

import { MotionConfig } from 'framer-motion'

// reducedMotion="user" makes framer-motion respect the OS "Reduce motion"
// setting automatically: transform/rotate/scale animations are disabled while
// opacity (and orchestration) still play — exactly the restrained fallback we want.
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

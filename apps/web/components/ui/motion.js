// Shared motion tokens — keep every animation on the same restrained,
// "quiet luxury" easing curve (a quint-out: smooth deceleration, no overshoot).
export const EASE = [0.22, 1, 0.36, 1]

// Parent orchestrator: fades nothing itself, just staggers its children.
export const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09 },
  },
}

// Child element: a slow, understated fade + slight upward settle.
export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
}

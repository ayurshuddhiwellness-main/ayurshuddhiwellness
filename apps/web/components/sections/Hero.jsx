'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'
import AnimatedLink from '../ui/AnimatedLink'

// Trust seals press down into place — rotate, scale and fade together,
// like a wax stamp. Disabled to a plain fade under reduced motion.
const sealVariants = {
  hidden: { opacity: 0, scale: 0.92, rotate: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

function TrustBadge({ label, sublabel }) {
  return (
    <motion.div
      variants={sealVariants}
      className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/30"
    >
      <div className="flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full border border-primary/20">
        <span className="font-serif text-[9px] font-semibold uppercase leading-tight tracking-widest text-primary">
          {label}
        </span>
        <span className="mt-0.5 font-serif text-[7px] uppercase tracking-wider text-primary/60">
          {sublabel}
        </span>
      </div>
    </motion.div>
  )
}

// Curtain reveal for a single headline line — slides up from a clipped frame.
// Under reduced motion, falls back to a plain opacity fade (no movement).
function HeadlineLine({ children, delay, reduce }) {
  if (reduce) {
    return (
      <motion.span
        className="block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    )
  }

  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative bg-background px-6 pb-32 pt-20 lg:px-12">
      <div className="mx-auto max-w-content">
        {/* Eyebrow — gentle fade just before the headline lifts */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mb-6 font-sans text-sm uppercase tracking-[0.25em] text-muted"
        >
          Ancient Ayurvedic Wellness
        </motion.p>

        {/* Headline — signature curtain reveal, plays once on load */}
        <h1 className="font-serif text-6xl font-normal leading-[1.1] text-foreground md:text-7xl lg:text-[5.5rem]">
          <HeadlineLine delay={0.25} reduce={reduce}>Ancient Wisdom.</HeadlineLine>
          <HeadlineLine delay={0.4} reduce={reduce}>Modern Balance.</HeadlineLine>
        </h1>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
          className="mt-6 max-w-md font-sans text-lg leading-relaxed text-muted"
        >
          AyurshuddhiWellness Ayurveda can help balance your mind, body, and personalised treatments.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.72 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <AnimatedLink
            href="#contact"
            arrow
            className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
          >
            Book your Life
          </AnimatedLink>
          <AnimatedLink
            href="#about"
            arrow
            className="inline-flex items-center rounded-full border border-border px-7 py-3 font-sans text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-white"
          >
            My Hero CTA
          </AnimatedLink>
        </motion.div>

        {/* Trust badges — seal into view on scroll, left then right */}
        <motion.div
          className="mt-16 flex justify-end gap-4 lg:mt-12"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <TrustBadge label="100%" sublabel="Organic" />
          <TrustBadge label="GMP" sublabel="Certified" />
        </motion.div>
      </div>
    </section>
  )
}

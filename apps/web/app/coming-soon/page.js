'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { EASE } from '../../components/ui/motion'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

// Minimal botanical leaf drawn via pathLength animation
const LEAF_PATH =
  'M60 190 C 55 150 70 110 60 70 C 55 45 65 20 75 5 M65 140 C 40 135 25 115 30 90 C 50 97 65 115 65 140 M60 100 C 85 95 100 78 96 55 C 76 62 60 78 60 100 M63 55 C 45 52 35 38 40 22 C 55 28 63 40 63 55'

export default function ComingSoonPage() {
  const reduce = useReducedMotion()
  const animated = !reduce

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Background botanical motif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 select-none text-primary opacity-[0.07] md:w-[360px]"
      >
        <svg
          viewBox="0 0 140 200"
          className="h-auto w-full"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d={LEAF_PATH}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 2.5, ease: 'easeInOut', delay: 0.3 }
            }
          />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-lg text-center"
        variants={animated ? container : undefined}
        initial={animated ? 'hidden' : false}
        whileInView={animated ? 'visible' : undefined}
        viewport={{ once: true }}
      >
        <motion.p
          variants={animated ? item : undefined}
          className="mb-5 font-sans text-sm uppercase tracking-[0.25em] text-primary"
        >
          Coming Soon
        </motion.p>

        <motion.h1
          variants={animated ? item : undefined}
          className="font-serif text-5xl font-normal leading-tight text-foreground md:text-6xl"
        >
          Something beautiful
          <br />
          is brewing.
        </motion.h1>

        <motion.p
          variants={animated ? item : undefined}
          className="mt-6 font-sans text-lg leading-relaxed text-muted"
        >
          We&rsquo;re crafting this space with the same care we bring to our
          practice. Check back soon — it&rsquo;ll be worth the wait.
        </motion.p>

        <motion.div variants={animated ? item : undefined} className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-primary px-8 py-3 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

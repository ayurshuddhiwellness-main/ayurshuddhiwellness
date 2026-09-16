'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { EASE } from '../ui/motion'
import SectionScrim from '../ui/SectionScrim'
import { EYEBROW, HEADING, BODY, PANEL, PANEL_BG, BTN_PRIMARY } from '../ui/surfaces'

/* The /blogs placeholder, as a section rather than a whole page.

   It was previously the entire route — a 'use client' page.js, which is why
   that route could never export metadata and inherited the generic site title.
   Splitting the animation out lets app/coming-soon/page.js be a server
   component again, and lets the route sit in the shared shell with a bar and a
   footer it never had. */

/* NOTE: `reduce` swaps the variant OBJECTS (whose transitions differ) but the
   `variants`/`initial`/`whileInView` props stay constant. This is load-bearing:
   `useReducedMotion()` is false during SSR and the first client render, so
   branching the props themselves applied `initial="hidden"` on that first pass
   and then removed the variants underneath it — stranding every line at
   opacity 0 for exactly the readers who asked for less motion. Same trap the
   comment in AboutPractitioner describes. */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const containerStill = { hidden: {}, visible: { transition: { staggerChildren: 0 } } }

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const itemStill = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
}

// Minimal botanical leaf drawn via pathLength animation
const LEAF_PATH =
  'M60 190 C 55 150 70 110 60 70 C 55 45 65 20 75 5 M65 140 C 40 135 25 115 30 90 C 50 97 65 115 65 140 M60 100 C 85 95 100 78 96 55 C 76 62 60 78 60 100 M63 55 C 45 52 35 38 40 22 C 55 28 63 40 63 55'

export default function ComingSoon() {
  const reduce = useReducedMotion()
  const it = reduce ? itemStill : item

  return (
    <section className="relative flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center overflow-hidden px-6 py-24">
      <SectionScrim focus="center" />

      {/* Background botanical motif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 select-none text-white opacity-[0.10] md:w-[360px]"
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
            transition={reduce ? { duration: 0 } : { duration: 2.5, ease: 'easeInOut', delay: 0.3 }}
          />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        style={{ background: PANEL_BG }}
        className={`relative z-10 mx-auto max-w-lg ${PANEL} px-8 py-12 text-center sm:px-12`}
        variants={reduce ? containerStill : container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.p variants={it} className={`mb-5 ${EYEBROW}`}>
          Coming Soon
        </motion.p>

        <motion.h1 variants={it} className={`${HEADING} text-4xl sm:text-5xl md:text-6xl`}>
          Something beautiful
          <br />
          is brewing.
        </motion.h1>

        <motion.p variants={it} className={`mt-6 ${BODY} text-lg`}>
          We&rsquo;re crafting this space with the same care we bring to our practice. Check back
          soon — it&rsquo;ll be worth the wait.
        </motion.p>

        <motion.div variants={it} className="mt-10">
          <Link href="/" className={BTN_PRIMARY}>
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

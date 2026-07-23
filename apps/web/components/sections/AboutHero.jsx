'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'
import { SPRIG_PATHS } from '../ui/sprigPaths'

const HEADLINE_LINES = ['Wisdom passed down.', 'Wellness made personal.']

const EYEBROW_DURATION = 0.5
const HEADLINE_START = 0.55
const LINE_STAGGER = 0.15
const BODY_DELAY = HEADLINE_START + LINE_STAGGER + 0.6

// NOTE: `reduce` only ever varies the `transition` prop here — never `initial`
// or the rendered DOM structure. `useReducedMotion()` is false during SSR and
// the first client render, so branching structure/initial on it strands
// elements at their server-rendered initial state. Transitions are applied by
// framer on the client after hydration, so varying them is safe.

function BotanicalMotif({ reduce }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-1/2 w-[45%] max-w-[420px] -translate-y-1/2 select-none text-primary opacity-[0.18] md:right-4"
    >
      <svg
        viewBox="0 0 320 520"
        className="h-auto w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {SPRIG_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 2.2, ease: 'easeInOut', delay: 0.2 }
            }
          />
        ))}
      </svg>
    </div>
  )
}

// Each line reveals as a single block — opacity + slight rise, line 2 trailing
// line 1 by LINE_STAGGER. Under reduced motion: no movement, instant delays.
function Headline({ reduce }) {
  return (
    <h1 className="font-serif text-5xl font-normal leading-tight text-foreground md:text-6xl">
      {HEADLINE_LINES.map((line, li) => (
        <motion.span
          key={li}
          className="block"
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: EASE,
            delay: reduce ? 0 : HEADLINE_START + li * LINE_STAGGER,
          }}
        >
          {line}
        </motion.span>
      ))}
    </h1>
  )
}

function StatCounter() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const started = useRef(false)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    if (reduce) {
      setValue(5000)
      return
    }

    // EASE is an ease-out curve: fast start, slow settle near the target.
    const controls = animate(0, 5000, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduce])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="mt-10 flex items-baseline gap-3"
    >
      <span className="font-serif text-5xl font-normal text-foreground md:text-6xl">
        {value.toLocaleString('en-US')}+
      </span>
      <span className="font-sans text-sm leading-snug text-muted">
        Years of Ayurvedic
        <br />
        wisdom, refined for today
      </span>
    </motion.div>
  )
}

export default function AboutHero() {
  const reduce = useReducedMotion()

  return (
    <section id="about" className="relative flex min-h-[90vh] items-center overflow-hidden bg-background px-6 lg:px-12">
      <BotanicalMotif reduce={reduce} />

      <div className="relative z-10 mx-auto w-full max-w-content">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: EYEBROW_DURATION, ease: EASE, delay: 0.1 }}
            className="mb-6 font-sans text-sm uppercase tracking-[0.25em] text-primary"
          >
            Our Story
          </motion.p>

          {/* Headline — word-by-word "lighting up" on load */}
          <Headline reduce={reduce} />

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : BODY_DELAY }}
            className="mt-8 max-w-md font-sans text-lg leading-relaxed text-muted"
          >
            AyurshuddhiWellness was founded on a simple belief — that ancient
            Ayurvedic science, applied with care and precision, can transform
            modern life.
          </motion.p>

          {/* Stat counter */}
          <StatCounter />
        </div>
      </div>
    </section>
  )
}

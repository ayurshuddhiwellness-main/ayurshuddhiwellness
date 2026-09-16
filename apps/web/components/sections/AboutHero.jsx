'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE } from '../ui/motion'
import { SPRIG_PATHS, SPRIG_VIEWBOX } from '../ui/sprigPaths'
import MaskReveal from '../ui/MaskReveal'
import SectionScrim from '../ui/SectionScrim'
import { EYEBROW, HEADING, BODY } from '../ui/surfaces'
import { useAboutIntroDone, releaseIfNoIntro } from '../../hooks/useAboutIntro'

const HEADLINE_LINES = ['Wisdom passed down.', 'Wellness made personal.']

// Delays are measured from the moment the splash releases, not from mount.
const EYEBROW_DELAY = 0.05
const HEADLINE_START = 0.15
const LINE_STAGGER = 0.14
const RULE_DELAY = 0.85
const BODY_DELAY = 0.95

// NOTE: `reduce` only ever varies the `transition` prop here — never `initial`
// or the rendered DOM structure. `useReducedMotion()` is false during SSR and
// the first client render, so branching structure/initial on it strands
// elements at their server-rendered initial state. Transitions are applied by
// framer on the client after hydration, so varying them is safe.

// Large line-art sprig anchored to the right edge. Each path draws itself in
// via pathLength, stems first, so the motif "grows" rather than fading on.
function BotanicalMotif({ reduce, play }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-16 top-1/2 w-[85%] max-w-[520px] -translate-y-1/2 select-none text-white opacity-[0.10] md:right-0 md:w-full md:opacity-[0.16]"
    >
      <svg
        viewBox={SPRIG_VIEWBOX}
        className="h-auto w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {SPRIG_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: play ? 1 : 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 2.4, ease: 'easeInOut', delay: 0.3 + i * 0.12 }
            }
          />
        ))}
      </svg>
    </div>
  )
}

export default function AboutHero() {
  const reduce = useReducedMotion()
  const done = useAboutIntroDone()
  const sectionRef = useRef(null)

  // If this route ever renders without AboutIntro, nothing would ever release
  // the hero — so claim the next frame and release it ourselves.
  useEffect(() => {
    const id = requestAnimationFrame(releaseIfNoIntro)
    return () => cancelAnimationFrame(id)
  }, [])

  // Scroll-linked exit: the column dissolves as it leaves rather than simply
  // scrolling off. Opacity only — nothing translates against the scroll, so
  // this stays clear of the parallax/motion-sickness pattern.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const exitFade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-32 lg:px-12"
    >
      <SectionScrim focus="left" />

      <motion.div
        style={{ opacity: reduce ? 1 : exitFade }}
        className="relative mx-auto grid w-full max-w-content items-center gap-16 md:grid-cols-12 md:gap-12"
      >
        {/* Left — editorial column */}
        <div className="relative z-10 md:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: EYEBROW_DELAY }
            }
            className={`mb-7 ${EYEBROW}`}
          >
            Our Story
          </motion.p>

          <h1 className={`${HEADING} text-4xl leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl`}>
            {HEADLINE_LINES.map((line, li) => (
              <MaskReveal
                key={line}
                trigger="mount"
                play={done}
                reduce={reduce}
                duration={0.95}
                delay={HEADLINE_START + li * LINE_STAGGER}
              >
                {line}
              </MaskReveal>
            ))}
          </h1>

          {/* Hairline rule that draws itself left-to-right under the headline */}
          <motion.div
            aria-hidden="true"
            className="mt-10 h-px w-full max-w-xs origin-left bg-white/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: done ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE, delay: RULE_DELAY }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE, delay: BODY_DELAY }}
            className={`mt-8 max-w-md ${BODY} text-lg`}
          >
            AyurshuddhiWellness was founded on a simple belief — that ancient Ayurvedic science,
            applied with care and precision, can transform modern life.
          </motion.p>
        </div>

        {/* Right — botanical motif column. Reserves height on desktop so the
            absolutely-positioned sprig has a column to sit against. */}
        <div className="relative hidden md:col-span-5 md:block md:h-[70vh]">
          <BotanicalMotif reduce={reduce} play={done} />
        </div>
      </motion.div>

      {/* Mobile motif — bleeds off the right edge behind the text */}
      <div className="md:hidden">
        <BotanicalMotif reduce={reduce} play={done} />
      </div>
    </section>
  )
}

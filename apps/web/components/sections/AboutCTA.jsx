'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import AnimatedLink from '../ui/AnimatedLink'
import MaskReveal from '../ui/MaskReveal'
import { SPRIG_PATHS, SPRIG_VIEWBOX } from '../ui/sprigPaths'
import SectionScrim from '../ui/SectionScrim'
import { EYEBROW, HEADING, BODY, BTN_PRIMARY } from '../ui/surfaces'

// Faint white sprig, mirrored on the opposite edge, drawn in on scroll.
// `reduce` varies only the transition — see AboutHero for why.
function Sprig({ className, flip, reduce, delay = 0 }) {
  return (
    <div aria-hidden="true" className={className}>
      <svg
        viewBox={SPRIG_VIEWBOX}
        className={`h-auto w-full ${flip ? '-scale-x-100' : ''}`}
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
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 2.2, ease: 'easeInOut', delay: delay + i * 0.1 }
            }
          />
        ))}
      </svg>
    </div>
  )
}

export default function AboutCTA() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden px-6 py-24 lg:px-12 lg:py-28">
      <SectionScrim focus="center" />

      <Sprig
        reduce={reduce}
        className="pointer-events-none absolute -left-10 top-1/2 w-[220px] -translate-y-1/2 select-none text-white opacity-[0.09] md:left-4 md:w-[280px]"
      />
      <Sprig
        reduce={reduce}
        flip
        delay={0.3}
        className="pointer-events-none absolute -right-10 top-1/2 hidden w-[280px] -translate-y-1/2 select-none text-white opacity-[0.09] md:right-4 md:block"
      />

      <RevealGroup className="relative z-10 mx-auto max-w-content text-center">
        <RevealItem>
          <p className={`mb-5 ${EYEBROW}`}>Begin Your Journey</p>
        </RevealItem>

        <h2 className={`${HEADING} text-4xl md:text-5xl`}>
          <MaskReveal reduce={reduce}>Ready to meet us?</MaskReveal>
        </h2>

        <RevealItem className="mt-5">
          <p className={`mx-auto max-w-lg ${BODY} text-lg`}>
            Schedule a consultation and experience Ayurveda tailored to you.
          </p>
        </RevealItem>

        <RevealItem className="mt-10">
          <AnimatedLink href="/contact" arrow className={BTN_PRIMARY}>
            Book a Consultation
          </AnimatedLink>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}

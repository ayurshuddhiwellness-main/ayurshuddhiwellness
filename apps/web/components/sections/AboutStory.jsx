'use client'

import { useRef } from 'react'
import { motion, useScroll, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'
import MaskReveal from '../ui/MaskReveal'
import RevealImage from '../ui/RevealImage'
import { STORY_BEATS as BEATS } from '../../lib/about-content'

// NOTE: `reduce` swaps variant objects (whose transitions differ) and varies
// transitions — never `initial` or the rendered DOM structure.
// `useReducedMotion()` is false during SSR and the first client render, so
// branching those strands elements at their server-rendered state.

const beatContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const beatItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const beatItemStill = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
}

// The node lands last and settles out of a slight contraction, so the rule
// reads as arriving at a marker rather than passing through one.
const node = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE, delay: 0.15 },
  },
}

const nodeStill = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0 } },
}

// One chapter of the journey. On md+ the block alternates sides of the centre
// rule; on mobile everything stacks to the right of a left-edge rule.
function Beat({ beat, index, reduce }) {
  const isLeft = index % 2 === 0
  const item = reduce ? beatItemStill : beatItem

  return (
    <motion.div
      variants={beatContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
      className="relative pb-20 pl-16 last:pb-0 md:grid md:grid-cols-2 md:gap-20 md:pb-28 md:pl-0"
    >
      {/* Node on the rule — numeral in a linen-filled circle so the rule
          appears to pass behind it */}
      <motion.div
        variants={reduce ? nodeStill : node}
        className="absolute left-4 top-1 z-10 -translate-x-1/2 md:left-1/2"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background font-serif text-base text-primary">
          {index + 1}
        </span>
      </motion.div>

      {/* Content block — column 1 or 2 on desktop, always left-aligned for
          readability even when it sits on the right of the rule */}
      <div
        className={
          isLeft
            ? 'md:col-start-1 md:row-start-1 md:pr-4'
            : 'md:col-start-2 md:row-start-1 md:pl-4'
        }
      >
        <RevealImage
          src={beat.image}
          alt={beat.alt}
          sizes="(max-width: 768px) 100vw, 40vw"
          priority={index === 0}
          reduce={reduce}
          className="aspect-[4/5]"
        />

        <motion.p
          variants={item}
          className="mb-4 mt-8 font-sans text-sm uppercase tracking-[0.25em] text-primary"
        >
          {beat.eyebrow}
        </motion.p>

        <h3 className="font-serif text-3xl font-normal leading-tight text-foreground md:text-4xl">
          <MaskReveal reduce={reduce} duration={0.85}>
            {beat.headline}
          </MaskReveal>
        </h3>

        <motion.p
          variants={item}
          className="mt-5 max-w-md font-sans text-lg leading-relaxed text-muted"
        >
          {beat.body}
        </motion.p>
      </div>
    </motion.div>
  )
}

export default function AboutStory() {
  const reduce = useReducedMotion()
  const trackRef = useRef(null)

  // Scroll-linked, not scroll-jacked: the rule's fill tracks natural scroll
  // position through the timeline and never intercepts the scroll itself.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 65%', 'end 75%'],
  })

  return (
    <section className="overflow-x-hidden bg-background px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-content">
        {/* Section heading */}
        <motion.div
          variants={beatContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-xl text-center"
        >
          <motion.p
            variants={reduce ? beatItemStill : beatItem}
            className="mb-4 font-sans text-sm uppercase tracking-[0.25em] text-primary"
          >
            Our Journey
          </motion.p>
          <h2 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl">
            <MaskReveal reduce={reduce}>Three chapters, one intention.</MaskReveal>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div ref={trackRef} className="relative mt-20 md:mt-28">
          {/* Unfilled track */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-4 w-px -translate-x-1/2 bg-border md:left-1/2"
          />
          {/* Sage fill that grows downward with scroll */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : scrollYProgress }}
            className="absolute inset-y-0 left-4 w-px origin-top -translate-x-1/2 bg-primary md:left-1/2"
          />

          {BEATS.map((beat, i) => (
            <Beat key={beat.eyebrow} beat={beat} index={i} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  )
}

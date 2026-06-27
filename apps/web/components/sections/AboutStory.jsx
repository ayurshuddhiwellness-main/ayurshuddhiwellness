'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'

const BEATS = [
  {
    eyebrow: '01 — The Roots',
    headline: 'A practice rooted in lineage.',
    body: 'AyurshuddhiWellness began not as a business, but as a continuation of family tradition — Ayurvedic knowledge passed down through generations.',
  },
  {
    eyebrow: '02 — The Study',
    headline: 'Refined through study.',
    body: 'What started as personal practice grew through rigorous clinical training, adapting centuries-old methods for the lives we live today.',
  },
  {
    eyebrow: '03 — The Practice',
    headline: 'Grown into a community.',
    body: 'Every consultation we offer carries that same intention: to treat the person, not just the symptom.',
  },
]

// The whole 70vh beat block is the single trigger + stagger parent, so the
// eyebrow, headline and body always reveal together. Gating each element
// separately with the tight -40%/-40% band meant the last beat's lower
// elements never reached the center band (the page can't scroll far enough).
const beatContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const beatItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

function Beat({ beat, index, reduce, onEnter }) {
  const animated = !reduce
  const itemVariants = animated ? beatItem : undefined

  return (
    <motion.div
      onViewportEnter={() => onEnter(index)}
      variants={animated ? beatContainer : undefined}
      initial={animated ? 'hidden' : false}
      whileInView={animated ? 'visible' : undefined}
      viewport={{ once: false, margin: '-35% 0px -35% 0px' }}
      className="flex min-h-[80vh] flex-col justify-center"
    >
      <motion.p
        variants={itemVariants}
        className="mb-5 font-sans text-sm uppercase tracking-[0.25em] text-primary"
      >
        {beat.eyebrow}
      </motion.p>
      <motion.h3
        variants={itemVariants}
        className="font-serif text-3xl font-normal leading-tight text-foreground md:text-4xl"
      >
        {beat.headline}
      </motion.h3>
      <motion.p
        variants={itemVariants}
        className="mt-5 max-w-md font-sans text-lg leading-relaxed text-muted"
      >
        {beat.body}
      </motion.p>
    </motion.div>
  )
}

export default function AboutStory() {
  const reduce = useReducedMotion()
  const [activeBeat, setActiveBeat] = useState(0)

  return (
    <section className="bg-background px-6 lg:px-12">
      <div className="mx-auto grid max-w-content md:grid-cols-12 md:gap-12">
        {/* Left — sticky image */}
        <div className="hidden md:col-span-5 md:block">
          <div className="sticky top-[20vh]">
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl bg-[#E8E4DD]">
              {BEATS.map((_, i) => (
                <motion.span
                  key={i}
                  initial={false}
                  animate={{ opacity: reduce ? 1 : activeBeat === i ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                  className="absolute font-sans text-sm text-muted"
                >
                  Founder image {i + 1}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — scrolling story beats */}
        <div className="md:col-span-7">
          {BEATS.map((beat, i) => (
            <Beat
              key={i}
              beat={beat}
              index={i}
              reduce={reduce}
              onEnter={setActiveBeat}
            />
          ))}
          {/* Extra scroll runway so beat 3 holds in view as long as 1 & 2 */}
          <div aria-hidden="true" className="h-[80vh]" />
        </div>
      </div>

      {/* Buffer so the sticky image fully releases before the next section */}
      <div aria-hidden="true" className="h-[25vh]" />
    </section>
  )
}

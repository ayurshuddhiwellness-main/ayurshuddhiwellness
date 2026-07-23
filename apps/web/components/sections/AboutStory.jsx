'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'
import { STORY_BEATS as BEATS } from '../../lib/about-content'

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
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#E8E4DD]">
              {BEATS.map((beat, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ opacity: reduce ? 1 : activeBeat === i ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={beat.image}
                    alt={beat.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </motion.div>
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

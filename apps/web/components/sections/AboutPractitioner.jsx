'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'

const CREDENTIALS = [
  'BAMS Certified',
  '15+ Years Practice',
  '500+ Clients Treated',
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export default function AboutPractitioner() {
  const reduce = useReducedMotion()
  const animated = !reduce

  return (
    <section className="bg-white px-6 py-24 lg:px-12">
      <motion.div
        className="mx-auto grid max-w-content items-center gap-12 md:grid-cols-12 md:gap-16"
        variants={animated ? container : undefined}
        initial={animated ? 'hidden' : false}
        whileInView={animated ? 'visible' : undefined}
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Left — Text */}
        <div className="md:col-span-7">
          <motion.p
            variants={animated ? item : undefined}
            className="mb-4 font-sans text-sm uppercase tracking-[0.25em] text-primary"
          >
            Your Practitioner
          </motion.p>

          <motion.h2
            variants={animated ? item : undefined}
            className="font-serif text-4xl font-normal leading-tight text-foreground"
          >
            Guided by experience.
          </motion.h2>

          <motion.p
            variants={animated ? item : undefined}
            className="mt-5 max-w-md font-sans text-lg leading-relaxed text-muted"
          >
            With years of dedicated study and clinical practice in Ayurvedic
            medicine, our lead practitioner brings deep expertise in Panchakarma
            therapy, herbal medicine, and personalised wellness planning.
          </motion.p>

          {/* Credential pills */}
          <motion.div
            variants={animated ? item : undefined}
            className="mt-8 flex flex-wrap gap-3"
          >
            {CREDENTIALS.map((label) => (
              <span
                key={label}
                className="rounded-full border border-border px-4 py-1.5 font-sans text-xs tracking-wide text-foreground"
              >
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right — Image placeholder */}
        <motion.div
          variants={animated ? item : undefined}
          className="md:col-span-5"
        >
          <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-[#E8E4DD]">
            <span className="font-sans text-sm text-muted">
              Practitioner portrait
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

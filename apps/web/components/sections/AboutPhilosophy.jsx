'use client'

import { motion } from 'framer-motion'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import { EASE } from '../ui/motion'

const PRINCIPLES = [
  {
    numeral: '01',
    title: 'Prakriti First',
    body: 'Every person has a unique constitution. We diagnose and treat according to your individual Prakriti, not generic protocols.',
  },
  {
    numeral: '02',
    title: 'Root Cause, Not Symptom',
    body: 'Ayurveda looks beyond surface symptoms to address the imbalance at its source — for lasting wellness, not temporary relief.',
  },
  {
    numeral: '03',
    title: 'Tradition Meets Evidence',
    body: 'We honor five thousand years of Ayurvedic science while staying grounded in what modern wellness research confirms works.',
  },
]

export default function AboutPhilosophy() {
  return (
    <motion.section
      initial={{ opacity: 0.4, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative z-10 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.08)] lg:px-12"
    >
      {/* Heading */}
      <RevealGroup className="mx-auto max-w-xl text-center">
        <RevealItem>
          <p className="mb-4 font-sans text-sm uppercase tracking-[0.25em] text-primary">
            What We Believe
          </p>
        </RevealItem>
        <RevealItem>
          <h2 className="font-serif text-4xl font-normal text-foreground">
            Our Philosophy
          </h2>
        </RevealItem>
      </RevealGroup>

      {/* Principles */}
      <RevealGroup className="mx-auto mt-16 grid max-w-content grid-cols-1 gap-12 md:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <RevealItem key={p.numeral}>
            <p className="font-serif text-3xl text-primary">{p.numeral}</p>
            <h3 className="mt-4 font-serif text-xl text-foreground">{p.title}</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{p.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </motion.section>
  )
}

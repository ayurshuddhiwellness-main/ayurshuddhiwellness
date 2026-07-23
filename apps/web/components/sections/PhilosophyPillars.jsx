'use client'

import { motion } from 'framer-motion'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import { EASE } from '../ui/motion'

/* ──────────────────────────────────────────────────────
   Each column pairs a philosophy principle (the "why")
   with its corresponding pillar service card (the "what"),
   so the section reads as one cohesive narrative instead
   of two blocks taped together.
   ────────────────────────────────────────────────────── */

const COLUMNS = [
  {
    numeral: '01',
    principle: 'Prakriti First',
    principleBody:
      'Every person has a unique constitution. We diagnose and treat according to your individual Prakriti, not generic protocols.',
    pillarTitle: 'Ayurveda',
    pillarBody:
      'Five-thousand-year-old healing science that restores balance through personalised herbal formulations, dietary guidance, and lifestyle rituals.',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 4 20 4s0 4.5-2 10.1A7 7 0 0 1 11 20z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  },
  {
    numeral: '02',
    principle: 'Root Cause, Not Symptom',
    principleBody:
      'Ayurveda looks beyond surface symptoms to address the imbalance at its source — for lasting wellness, not temporary relief.',
    pillarTitle: 'Panchakarma',
    pillarBody:
      'Classical five-fold Ayurvedic detoxification therapy that deeply purifies tissues, removes accumulated toxins, and rejuvenates the entire body.',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  {
    numeral: '03',
    principle: 'Tradition Meets Evidence',
    principleBody:
      'We honor five thousand years of Ayurvedic science while staying grounded in what modern wellness research confirms works.',
    pillarTitle: 'Yoga & Meditation',
    pillarBody:
      'Mind-body disciplines that cultivate inner stillness, build physical strength, and awaken a deeper awareness for lasting well-being.',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M12 20c0-4-3.5-7.5-7.5-7.5S12 5 12 5s7.5 3 7.5 7.5S12 20 12 20z" />
        <path d="M12 20c0-4 3.5-7.5 7.5-7.5" />
        <path d="M12 20c0-4-3.5-7.5-7.5-7.5" />
        <path d="M12 5c-1.5 2-2 4.5-2 7" />
        <path d="M12 5c1.5 2 2 4.5 2 7" />
      </svg>
    ),
  },
]

export default function PhilosophyPillars() {
  return (
    <motion.section
      initial={{ opacity: 0.4, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative z-10 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.08)] lg:px-12"
      id="services"
    >
      {/* Section heading — Philosophy framing */}
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

      {/* Combined columns: principle → service card */}
      <RevealGroup className="mx-auto mt-16 grid max-w-content grid-cols-1 gap-10 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <RevealItem key={col.numeral} className="flex flex-col gap-8">
            {/* Philosophy principle (narrative layer) */}
            <div>
              <p className="font-serif text-3xl text-primary">{col.numeral}</p>
              <h3 className="mt-3 font-serif text-xl text-foreground">
                {col.principle}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted">
                {col.principleBody}
              </p>
            </div>

            {/* Pillar service card (concrete layer) */}
            <div className="flex-1 rounded-2xl border border-border bg-white p-8 transition-shadow duration-300 hover:shadow-soft">
              <div className="mb-6">{col.icon}</div>
              <h3 className="font-serif text-xl text-foreground">
                {col.pillarTitle}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-muted">
                {col.pillarBody}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </motion.section>
  )
}

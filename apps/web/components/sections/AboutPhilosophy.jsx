'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import { EASE } from '../ui/motion'
import MaskReveal from '../ui/MaskReveal'

/* Line-art marks — one per principle. Declared as shape tuples rather than
   literal JSX so each stroke can be handed the same draw-in treatment: they
   render as motion.circle / motion.path and unspool via pathLength, matching
   the botanical sprig elsewhere on the page. All sit on one 24px grid at a
   1.25 stroke so they read as a set, not as clip-art. */
const PRAKRITI = [
  ['circle', { cx: 12, cy: 8.5, r: 5 }],
  ['circle', { cx: 7.5, cy: 15.5, r: 5 }],
  ['circle', { cx: 16.5, cy: 15.5, r: 5 }],
]

const ROOT = [
  ['path', { d: 'M12 2.5v19' }],
  ['path', { d: 'M3.5 11.5h17' }],
  ['path', { d: 'M12 8c0-2.2 1.8-4 4-4' }],
  ['path', { d: 'M12 9.5C12 7.6 10.4 6 8.5 6' }],
  ['path', { d: 'M12 14.5c0 2.6-1.9 4.8-4.5 6' }],
  ['path', { d: 'M12 14.5c0 2.6 1.9 4.8 4.5 6' }],
]

const PULSE = [
  ['path', { d: 'M2.5 12H7' }],
  ['path', { d: 'M7 12l2.5-6.5 3.5 13 2.5-6.5' }],
  ['path', { d: 'M15.5 12h6' }],
]

const drawProps = (reduce, i) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: reduce
    ? { duration: 0 }
    : {
        pathLength: { duration: 1.2, ease: EASE, delay: 0.2 + i * 0.1 },
        opacity: { duration: 0.3, ease: EASE, delay: 0.2 + i * 0.1 },
      },
})

function Mark({ shapes, reduce }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-9 w-9 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes.map(([el, props], i) => {
        const Shape = el === 'circle' ? motion.circle : motion.path
        return <Shape key={i} {...props} {...drawProps(reduce, i)} />
      })}
    </svg>
  )
}

const PRINCIPLES = [
  {
    numeral: '01',
    title: 'The Root Cause',
    body: 'Every disease has a reason. We find it before we treat it.',
    shapes: ROOT,
    surface: 'bg-card',
  },
  {
    numeral: '02',
    title: 'We Listen to Your Body',
    body: 'Symptoms are the body’s last resort.',
    shapes: PULSE,
    surface: 'bg-background',
  },
  {
    numeral: '03',
    title: 'A Personalised Treatment Plan',
    body: 'There is no ‘one-size-fits-all’ in wellness.',
    shapes: PRAKRITI,
    surface: 'bg-card',
  },
]

export default function AboutPhilosophy() {
  const reduce = useReducedMotion()

  return (
    // Rising panel: the section lifts over the timeline above it. `reduce`
    // varies only the transition, never `initial` — see AboutHero for why.
    <motion.section
      initial={{ opacity: 0.4, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, ease: EASE }}
      className="relative z-10 overflow-x-hidden rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.08)] lg:px-12 lg:py-32"
    >
      <RevealGroup className="mx-auto max-w-xl text-center">
        <RevealItem>
          <p className="mb-4 font-sans text-sm uppercase tracking-[0.25em] text-primary">
            What We Believe
          </p>
        </RevealItem>
        <h2 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl">
          <MaskReveal reduce={reduce}>Our Philosophy</MaskReveal>
        </h2>
      </RevealGroup>

      <RevealGroup className="mx-auto mt-16 grid max-w-content grid-cols-1 items-start gap-8 md:mt-20 md:grid-cols-3">
        {PRINCIPLES.map((p, i) => (
          <RevealItem
            key={p.numeral}
            /* Middle card rides lower on desktop — asymmetry keeps the row
               from reading as a plain three-up grid. */
            className={i === 1 ? 'md:mt-12' : undefined}
          >
            <article
              className={`group relative h-full overflow-hidden rounded-2xl border border-border ${p.surface} p-8 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
            >
              {/* Ghost numeral — decorative, settles in behind the content */}
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 0.07, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 1.1, ease: EASE, delay: 0.15 }
                }
                className="pointer-events-none absolute -right-2 -top-6 select-none font-serif text-[7rem] leading-none text-primary"
              >
                {p.numeral}
              </motion.span>

              <div className="relative">
                <Mark shapes={p.shapes} reduce={reduce} />

                <p className="mt-6 font-sans text-xs uppercase tracking-[0.25em] text-primary">
                  {p.numeral}
                </p>

                <h3 className="mt-3 font-serif text-2xl font-normal leading-snug text-foreground">
                  <MaskReveal reduce={reduce} duration={0.8} delay={0.1}>
                    {p.title}
                  </MaskReveal>
                </h3>

                <p className="mt-3 font-sans text-base leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </motion.section>
  )
}

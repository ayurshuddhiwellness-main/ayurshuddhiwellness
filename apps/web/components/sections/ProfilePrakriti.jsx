'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import AnimatedLink from '../ui/AnimatedLink'
import { EASE } from '../ui/motion'
import { PRAKRITI } from '../../lib/profile-mock'

/* The dosha bars fill via `scaleX` on a left origin rather than by animating
   `width`. Visually identical, but it keeps to the rule in DESIGN_SYSTEM_3.md
   that only transform and opacity are animated — animating width would lay out
   on every frame. As elsewhere, `reduce` varies only the transition, never
   `initial` or the rendered structure. */
function DoshaBar({ dosha, index, reduce }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-sans text-sm text-foreground">{dosha.name}</span>
        <span className="font-sans text-sm tabular-nums text-muted">
          {dosha.value}%
        </span>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full w-full origin-left rounded-full bg-primary"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: dosha.value / 100 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 1.1, ease: EASE, delay: 0.15 + index * 0.12 }
          }
        />
      </div>
    </div>
  )
}

export default function ProfilePrakriti() {
  const reduce = useReducedMotion()

  return (
    <section className="bg-background px-6 pb-16 lg:px-12">
      <RevealGroup className="mx-auto max-w-content">
        <RevealItem>
          <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary">
              Your Prakriti
            </p>

            {PRAKRITI ? (
              <>
                <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
                  <div>
                    <h2 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl">
                      {PRAKRITI.type}
                    </h2>
                    <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-muted">
                      {PRAKRITI.summary}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center gap-6">
                    {PRAKRITI.doshas.map((dosha, i) => (
                      <DoshaBar
                        key={dosha.name}
                        dosha={dosha}
                        index={i}
                        reduce={reduce}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-10">
                  <AnimatedLink
                    href="/book"
                    className="inline-flex items-center rounded-full border border-border px-6 py-2.5 font-sans text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  >
                    Retake Assessment
                  </AnimatedLink>
                </div>
              </>
            ) : (
              /* Reached once real data lands and a user has not been assessed */
              <div className="mt-6 max-w-md">
                <h2 className="font-serif text-3xl font-normal leading-tight text-foreground md:text-4xl">
                  Discover your Prakriti
                </h2>
                <p className="mt-4 font-sans text-base leading-relaxed text-muted">
                  Your constitution shapes everything we would recommend — what
                  to eat, when to rest, which therapies suit you. It takes a few
                  minutes to establish.
                </p>
                <AnimatedLink
                  href="/book"
                  arrow
                  className="mt-8 inline-flex items-center rounded-full bg-primary px-6 py-2.5 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  Take Assessment
                </AnimatedLink>
              </div>
            )}
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}

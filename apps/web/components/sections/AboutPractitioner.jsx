'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'
import MaskReveal from '../ui/MaskReveal'
import AnimatedLink from '../ui/AnimatedLink'

const CREDENTIALS = [
  'Nadi Vaidya',
  'Ayurveda',
  'Human Design',
  'Spirituality',
]

// NOTE: `reduce` swaps the *variant objects* (whose transitions differ) but the
// `initial="hidden"` prop and DOM structure stay constant — `useReducedMotion()`
// is false during SSR/first client render, so branching those strands elements.
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const itemStill = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
}

// Credential pills arrive individually rather than as one block.
const pills = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const pill = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const pillStill = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
}

/* `id` is passed only by the homepage, which uses this as its About section and
   needs the "/#about" nav target. On /about the page hero already owns that id,
   so passing it here too would duplicate it. */
export default function AboutPractitioner({ exploreLink = false, id, snap = false }) {
  const reduce = useReducedMotion()
  const it = reduce ? itemStill : item

  return (
    <section
      id={id}
      /* `snap` is passed by the homepage alone, which runs a gesture lock over
         its sections. /about renders this same component in ordinary document
         flow, so the stop and the viewport height have to be opt-in or that
         page would inherit a sizing it has no lock to justify. */
      data-snap-section={snap ? '' : undefined}
      /* scroll-mt-16 clears the 64px sticky navbar when arriving via /#about */
      className={[
        'scroll-mt-16 overflow-x-hidden px-6 py-24 lg:px-12 lg:py-32',
        snap && 'flex flex-col justify-center motion-safe:min-h-screen',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <motion.div
        className="mx-auto grid max-w-content items-center gap-14 md:grid-cols-12 md:gap-16"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Left — portrait, with a sage block offset behind the frame */}
        <motion.div variants={it} className="md:col-span-5">
          <div className="relative">
            {/* Offset block slides into place from under the frame */}
            <motion.div
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 h-full w-full rounded-2xl bg-primary/10"
              initial={{ x: 12, y: -12, opacity: 0 }}
              whileInView={{ x: 0, y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 1, ease: EASE, delay: 0.25 }
              }
            />

            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-background">
              {/* The source is 3:2 landscape holding a two-person scene — the
                  practitioner reading a pulse, the patient facing him. A 3:4
                  portrait aperture threw away half that frame and left the
                  patient as a disembodied arm at the edge, whichever way the
                  crop was pushed. Square keeps ~67% of the width, which is
                  enough for both faces, both hands and the notebook, so the
                  photograph still reads as the consultation it is. Centred,
                  because the composition is already balanced about its middle. */}
              <Image
                src="/images/about/abhirath.JPG"
                alt="Acharya Abbhiraath Singh reading a patient's pulse during a Nadi Pariksha consultation"
                fill
                sizes="(min-width: 768px) 40vw, 92vw"
                className="object-cover object-center"
              />

              {/* Same retracting panel the story images use, so the two
                  columns of the page reveal with one shared gesture. */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 origin-top bg-card"
                initial={{ scaleY: 1 }}
                whileInView={{ scaleY: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={
                  reduce ? { duration: 0 } : { duration: 1.05, ease: EASE }
                }
              />
            </div>
          </div>
        </motion.div>

        {/* Right — credentials and copy */}
        <div className="md:col-span-7">
          <motion.p
            variants={it}
            className="mb-4 font-sans text-sm uppercase tracking-[0.25em] text-primary"
          >
            Your Practitioner
          </motion.p>

          <h2 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl">
            <MaskReveal reduce={reduce}>Acharya Abbhiraath Singh</MaskReveal>
          </h2>

          <motion.p
            variants={it}
            className="mt-4 font-sans text-base tracking-wide text-primary"
          >
            Nadi Vaidya &amp; Ayurvedacharya
          </motion.p>

          <motion.p
            variants={it}
            className="mt-6 max-w-lg font-sans text-lg leading-relaxed text-muted"
          >
            Trained under Himalayan Gurus in the ancient art of pulse diagnosis,
            he has spent over a decade developing an approach to health that
            goes beyond symptoms and addresses the root cause of what the body
            is experiencing. He holds a Master&rsquo;s degree in Yogic Science
            with a specialisation in Nadi Vaidya, and works with individuals
            across physical, emotional, and spiritual dimensions of well-being.
          </motion.p>

          {/* Pull-quote — the sage rule draws down before the line lifts in */}
          <motion.blockquote variants={it} className="relative mt-10 pl-6">
            <motion.span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-px origin-top bg-primary"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.9, ease: EASE }
              }
            />
            <p className="max-w-md font-serif text-2xl font-normal italic leading-snug text-foreground">
              <MaskReveal reduce={reduce} duration={0.85} delay={0.2}>
                Every person is different. Real healing begins only when those
                differences are truly seen and understood.
              </MaskReveal>
            </p>
          </motion.blockquote>

          <motion.div
            variants={pills}
            className="mt-10 flex flex-wrap gap-3"
          >
            {CREDENTIALS.map((label) => (
              <motion.span
                key={label}
                variants={reduce ? pillStill : pill}
                className="rounded-full border border-border px-4 py-1.5 font-sans text-xs tracking-wide text-foreground"
              >
                {label}
              </motion.span>
            ))}
          </motion.div>

          {/* Homepage only — on /about this section is already the destination,
              so the link would point at the page you are standing on. */}
          {exploreLink && (
            <motion.div variants={it} className="mt-10">
              <AnimatedLink
                href="/about"
                arrow
                className="inline-flex items-center rounded-full bg-primary px-8 py-3.5 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Explore Us
              </AnimatedLink>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  )
}

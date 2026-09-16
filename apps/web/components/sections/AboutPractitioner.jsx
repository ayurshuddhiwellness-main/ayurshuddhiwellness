'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'
import MaskReveal from '../ui/MaskReveal'
import SectionScrim from '../ui/SectionScrim'
import AnimatedLink from '../ui/AnimatedLink'

const CREDENTIALS = ['Nadi Vaidya', 'Ayurveda', 'Human Design', 'Spirituality']

/* ──────────────────────────────────────────────────────────────────────────
   One section, rendered over the page photograph, on two routes.

   This used to carry a second palette — dark tokens on linen — selected by an
   `onMedia` flag, from when /about was a linen page and only the homepage sat
   over PageBackdrop. Once the shared backdrop put the photograph behind every
   route, both call sites passed `onMedia` and that whole branch became
   unreachable: a table of classes describing a rendering the site no longer
   produces. It has been removed rather than left to be read as a live option.

   What remains is the measurement that decided it. The dark tokens need an
   almost opaque linen bed to clear 4.5:1 over this photograph — an opaque card
   in all but name — whereas light type on a graded dark scrim clears it while
   leaving the picture visible through. ServiceSection documents the same trade.

   `summary` still varies, and is a separate axis from palette: the homepage
   gets the short biography, /about keeps the long one because it is the page
   that owns the full story.
   ────────────────────────────────────────────────────────────────────────── */

/* Over the photograph. Light type throughout, a text-shadow on anything set
   small enough to be eaten by a busy frame, and a rhythm down the column that
   steps up as it goes: the label, name and role sit close as one identity
   block, then the description, the pills and the call to action each take more
   air than the last. */
const MEDIA = {
  grid: 'gap-12 md:grid-cols-12 md:gap-16',
  portrait: 'relative mx-auto w-full max-w-sm md:max-w-none',
  offset: 'bg-[color-mix(in_srgb,var(--color-primary)_35%,transparent)]',
  frame: 'border-white/20 bg-black/20 shadow-[0_28px_70px_-28px_rgba(0,0,0,0.8)]',
  eyebrow: 'text-xs text-white/75 sm:text-sm',
  heading:
    'mt-3 text-3xl text-background [text-shadow:0_1px_3px_rgba(0,0,0,0.5),0_6px_30px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-5xl',
  subtitle: 'mt-3 text-white/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]',
  body: 'mt-6 max-w-2xl text-base text-white/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] sm:text-lg md:mt-7',
  pillRow: 'mt-8 gap-2.5 sm:gap-3 md:mt-10',
  /* Held a clear step below the call to action: translucent rather than
     filled, hairline rather than solid, type a shade off white. They read as
     labels, which is what they are — not four more things to press. */
  pill: 'border-white/25 bg-white/10 px-4 py-2 text-white/90 backdrop-blur-[2px] transition-colors duration-300 hover:border-white/40 hover:bg-white/15',
  ctaRow: 'mt-10 md:mt-12',
  /* A ring and a cast shadow, so the one filled element sits above the picture
     rather than in it. The focus ring goes white — the linen offset it used is
     invisible here. */
  cta: 'shadow-[0_14px_34px_-14px_rgba(0,0,0,0.75)] ring-1 ring-white/15 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
}

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

/* The pull-quote. It closes the section as a band of its own rather than
   sitting inside the practitioner's column: in the column it competed with the
   name, the pills and the call to action at once, and lost to the photograph
   behind all four. */
function PullQuote({ reduce, variants }) {
  return (
    <motion.blockquote
      variants={variants}
      className="mx-auto mt-14 max-w-2xl text-center md:mt-16"
    >
      {/* The rule draws itself before the line lifts in. */}
      <motion.span
        aria-hidden="true"
        className="mx-auto mb-6 block h-px w-12 origin-center bg-primary"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE }}
      />
      <p
        className="font-serif font-normal italic leading-snug text-xl text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.55),0_4px_24px_rgba(0,0,0,0.6)] md:text-2xl"
      >
        <MaskReveal reduce={reduce} duration={0.85} delay={0.2}>
          Every person is different. Real healing begins only when those differences are truly seen
          and understood.
        </MaskReveal>
      </p>
    </motion.blockquote>
  )
}

/* `id` is passed only by the homepage, which uses this as its About section and
   needs the "/#about" nav target. On /about the page hero already owns that id,
   so passing it here too would duplicate it. */
export default function AboutPractitioner({
  exploreLink = false,
  id,
  snap = false,
  /* Copy length. The homepage gets the short biography; /about keeps the long
     one, since it is the page the "Explore Us" link sends you to for exactly
     that. */
  summary = false,
}) {
  const reduce = useReducedMotion()
  const it = reduce ? itemStill : item
  const t = MEDIA

  return (
    <section
      id={id}
      /* `snap` is passed by the homepage alone, which runs a gesture lock over
         its sections. /about renders this same component in ordinary document
         flow, so the stop and the viewport height have to be opt-in or that
         page would inherit a sizing it has no lock to justify. */
      data-snap-section={snap ? '' : undefined}
      /* scroll-mt-16 clears the 64px sticky navbar when arriving via /#about.
         `relative` is what the scrim below positions against. */
      className={[
        'relative scroll-mt-16 overflow-x-hidden px-6 py-24 lg:px-12 lg:py-32',
        snap && 'flex flex-col justify-center motion-safe:min-h-screen',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── The section's own scrim, over the page photograph ───────────────
          Two elements rather than one, because the gradient's direction has to
          follow the layout: the columns sit side by side above md and stacked
          below it, and a horizontal wash under a stacked column would darken
          the wrong half of the frame. */}
      <SectionScrim focus="right" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-content"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className={`grid items-center ${t.grid}`}>
          {/* Left — portrait, with a sage block offset behind the frame */}
          <motion.div variants={it} className="md:col-span-5">
            <div className={t.portrait}>
              {/* Offset block slides into place from under the frame */}
              <motion.div
                aria-hidden="true"
                className={`absolute -bottom-4 -left-4 h-full w-full rounded-2xl ${t.offset}`}
                initial={{ x: 12, y: -12, opacity: 0 }}
                whileInView={{ x: 0, y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={reduce ? { duration: 0 } : { duration: 1, ease: EASE, delay: 0.25 }}
              />

              <div
                className={`relative aspect-square overflow-hidden rounded-2xl border ${t.frame}`}
              >
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
                  transition={reduce ? { duration: 0 } : { duration: 1.05, ease: EASE }}
                />
              </div>
            </div>
          </motion.div>

          {/* Right — credentials and copy */}
          <div className="md:col-span-7">
            <motion.p
              variants={it}
              className={`font-sans uppercase tracking-[0.25em] ${t.eyebrow}`}
            >
              Your Practitioner
            </motion.p>

            <h2 className={`font-serif font-normal leading-tight ${t.heading}`}>
              <MaskReveal reduce={reduce}>Acharya Abbhiraath Singh</MaskReveal>
            </h2>

            <motion.p variants={it} className={`font-sans text-base tracking-wide ${t.subtitle}`}>
              Nadi Vaidya &amp; Ayurvedacharya
            </motion.p>

            {/* The same facts, at two lengths. The homepage gets the summary —
                who he is, what he practises, how he works — and /about keeps
                the full paragraph, since it is the page the "Explore Us" link
                below sends you to for exactly that. */}
            <motion.p variants={it} className={`font-sans leading-relaxed ${t.body}`}>
              {summary ? (
                <>
                  Trained under Himalayan Gurus in the ancient art of pulse diagnosis, with a
                  Master&rsquo;s in Yogic Science specialising in Nadi Vaidya. Over a decade spent
                  addressing root causes across the physical, emotional and spiritual.
                </>
              ) : (
                <>
                  Trained under Himalayan Gurus in the ancient art of pulse diagnosis, he has spent
                  over a decade developing an approach to health that goes beyond symptoms and
                  addresses the root cause of what the body is experiencing. He holds a
                  Master&rsquo;s degree in Yogic Science with a specialisation in Nadi Vaidya, and
                  works with individuals across physical, emotional, and spiritual dimensions of
                  well-being.
                </>
              )}
            </motion.p>

            <motion.div variants={pills} className={`flex flex-wrap ${t.pillRow}`}>
              {CREDENTIALS.map((label) => (
                <motion.span
                  key={label}
                  variants={reduce ? pillStill : pill}
                  className={`rounded-full border font-sans text-xs tracking-wide ${t.pill}`}
                >
                  {label}
                </motion.span>
              ))}
            </motion.div>

            {/* Homepage only — on /about this section is already the destination,
                so the link would point at the page you are standing on. */}
            {exploreLink && (
              <motion.div variants={it} className={t.ctaRow}>
                <AnimatedLink
                  href="/about"
                  arrow
                  className={`inline-flex items-center rounded-full bg-primary px-8 py-3.5 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 ${t.cta}`}
                >
                  Explore Us
                </AnimatedLink>
              </motion.div>
            )}
          </div>
        </div>

        <PullQuote reduce={reduce} variants={it} />
      </motion.div>
    </section>
  )
}

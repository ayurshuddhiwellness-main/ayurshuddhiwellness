'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'
import MaskReveal from '../ui/MaskReveal'
import AnimatedLink from '../ui/AnimatedLink'

const CREDENTIALS = ['Nadi Vaidya', 'Ayurveda', 'Human Design', 'Spirituality']

/* ──────────────────────────────────────────────────────────────────────────
   Two renderings of one section.

   /about renders this on linen, in the dark tokens, with the full story — it
   is the page that owns the biography. The homepage renders it over the fixed
   photograph (PageBackdrop), where those same dark tokens were unreadable:
   #1E2220 body copy on a darkened picture. `onMedia` is what tells the two
   apart, and it moves three things together — the palette inverts to light,
   the section lays a scrim of its own, and the copy shortens to a summary,
   because the long version has a page of its own to live on.

   Measured the way ServiceSection was: the dark tokens need an almost opaque
   linen bed to clear 4.5:1 over this photograph, whereas light type on a
   graded dark scrim clears it while leaving the picture visible through.

   Every class the two renderings disagree on is in the table below rather than
   spread through the JSX as a dozen ternaries, so the /about column can be
   read straight down and checked against what that page rendered before.
   ────────────────────────────────────────────────────────────────────────── */

/* Wide: the weight is carried toward the copy column on the right and feathers
   away to nothing over the portrait, so the left of the frame — the
   photograph's open foreground — is left alone. A radial pool does the work
   under the copy itself; the linear layer only tips the balance across the
   width. Deliberately no flat fill: a uniform box over this section is the
   black rectangle this replaces. */
const SCRIM_WIDE =
  'radial-gradient(ellipse 54% 62% at 74% 50%, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.27) 48%, transparent 78%),' +
  'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.04) 34%, rgba(0,0,0,0.17) 62%, rgba(0,0,0,0.30) 100%)'

/* Narrow: the columns stack, so the copy sits under the portrait rather than
   beside it and the weight has to run down the frame instead of across it. */
const SCRIM_NARROW =
  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.10) 20%, rgba(0,0,0,0.40) 52%, rgba(0,0,0,0.44) 100%)'

/* Both scrims are masked away at the section's own top and bottom edges, so
   the treatment never ends on a hard line where the next section begins — the
   photograph runs on underneath it, uninterrupted. */
const FEATHER = 'linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)'

/* On linen. These are the values this section shipped with, unchanged: /about
   renders exactly what it rendered before. */
const LINEN = {
  grid: 'gap-14 md:grid-cols-12 md:gap-16',
  portrait: 'relative',
  /* KNOWN, LEFT ALONE: `bg-primary/10` compiles to fully opaque sage. The
     theme colours are bare var() values with no <alpha-value>, so Tailwind
     drops the alpha modifier (the same trap Hero.jsx and Navbar.jsx document)
     and this offset block renders at 100%, not the 10% it reads as. The
     homepage row below uses color-mix and is correct; this one is kept as-is
     so /about is not changed by a redesign it was not part of. */
  offset: 'bg-primary/10',
  frame: 'border-border bg-background',
  eyebrow: 'mb-4 text-sm text-primary',
  heading: 'text-4xl text-foreground md:text-5xl',
  subtitle: 'mt-4 text-primary',
  body: 'mt-6 max-w-lg text-lg text-muted',
  pillRow: 'mt-10 gap-3',
  pill: 'border-border px-4 py-1.5 text-foreground',
  ctaRow: 'mt-10',
  cta: 'focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
}

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

/* The pull-quote, written once so the two layouts can put it in two different
   places without the words existing twice.

   On /about it stays where it has always been — in the right-hand column under
   the biography, hung off a sage rule. On the homepage it is lifted out of the
   practitioner's details entirely and closes the section as a band of its own:
   sat inside the column it was competing with the name, the pills and the call
   to action at once, and losing to the photograph behind all four. */
function PullQuote({ onMedia, reduce, variants }) {
  return (
    <motion.blockquote
      variants={variants}
      className={onMedia ? 'mx-auto mt-14 max-w-2xl text-center md:mt-16' : 'relative mt-10 pl-6'}
    >
      {/* The rule draws itself before the line lifts in. Horizontal and centred
          over the photograph, vertical and hung to the left on linen. */}
      <motion.span
        aria-hidden="true"
        className={
          onMedia
            ? 'mx-auto mb-6 block h-px w-12 origin-center bg-primary'
            : 'absolute left-0 top-0 h-full w-px origin-top bg-primary'
        }
        initial={onMedia ? { scaleX: 0 } : { scaleY: 0 }}
        whileInView={onMedia ? { scaleX: 1 } : { scaleY: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE }}
      />
      <p
        className={`font-serif font-normal italic leading-snug ${
          onMedia
            ? 'text-xl text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.55),0_4px_24px_rgba(0,0,0,0.6)] md:text-2xl'
            : 'max-w-md text-2xl text-foreground'
        }`}
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
   so passing it here too would duplicate it.

   `onMedia` is likewise the homepage's alone — see the note at the top. */
export default function AboutPractitioner({
  exploreLink = false,
  id,
  snap = false,
  onMedia = false,
}) {
  const reduce = useReducedMotion()
  const it = reduce ? itemStill : item
  const t = onMedia ? MEDIA : LINEN

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
      {onMedia && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 md:hidden"
            style={{ background: SCRIM_NARROW, maskImage: FEATHER, WebkitMaskImage: FEATHER }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{ background: SCRIM_WIDE, maskImage: FEATHER, WebkitMaskImage: FEATHER }}
          />
        </>
      )}

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
              {onMedia ? (
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

            {/* On linen the quote still belongs to this column, under the
                biography it qualifies. Over the photograph it has been lifted
                out to the foot of the section — see PullQuote. */}
            {!onMedia && <PullQuote onMedia={false} reduce={reduce} variants={it} />}

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

        {onMedia && <PullQuote onMedia reduce={reduce} variants={it} />}
      </motion.div>
    </section>
  )
}

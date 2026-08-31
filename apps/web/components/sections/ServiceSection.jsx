import Image from 'next/image'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import AnimatedLink from '../ui/AnimatedLink'
import { SERVICE_ICONS } from '../ui/serviceIcons'
import { SERVICES } from '../../lib/services'

/* ──────────────────────────────────────────────────────────────────────────
   One headline service, given a whole viewport.

   These were three cards in a grid inside a single `services` section. They
   are now three sections in their own right, each a scroll-lock stop of its
   own — SectionLock reads its stops off `[data-snap-section]` every gesture,
   so nothing there needed changing to pick them up.

   Copy, imagery, icons and the Read More target all come from lib/services.js,
   the same catalogue that feeds /services, so nothing is duplicated here and
   the two can never drift.

   `service.imageFit` is deliberately NOT used: that field is tuned for the 4:5
   aperture the old card had, and lib/services.js says so explicitly. These
   halves are tall, full-bleed panels, so the plain cover crop is correct.

   The content half carries a dark scrim and light type rather than a linen
   panel. Measured against the page backdrop: the dark tokens need ~95% linen
   to clear 4.5:1 over this photograph — an opaque card in all but name —
   whereas light type over a dark scrim clears it at around 35%, which leaves
   the picture visible through the copy. The scrim is also graded, heaviest at
   the outer edge and thinnest where it meets the photograph, so the two halves
   meet without a seam down the middle.
   ────────────────────────────────────────────────────────────────────────── */

const byslug = (slug) => SERVICES.find((s) => s.slug === slug)

export default function ServiceSection({
  slug,
  flip = false,
  id,
  header = null,
  footer = null,
}) {
  const service = byslug(slug)
  if (!service) return null

  const Icon = SERVICE_ICONS[slug]

  return (
    <section
      id={id}
      data-snap-section
      /* scroll-mt-16 clears the sticky bar for /#services. The viewport height
         is a minimum, matching the rest of the page: content taller than one
         screen grows rather than clipping, and SectionLock gives anything that
         overruns its own bottom-aligned stop. */
      className="relative flex scroll-mt-16 motion-safe:min-h-screen"
    >
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        {/* ── Photograph — a framed panel centred in its half ─────────────
            Not full-bleed: the picture sits in a container of its own, at
            roughly half the footprint of the half it occupies, so the page
            backdrop reads around all four sides of it rather than the
            photograph owning the whole side. The frame is what carries the
            rounding, the clip and the edge; the Image only ever fills the
            frame. */}
        <div
          className={`flex min-h-[38vh] items-center justify-center p-8 md:min-h-0 lg:p-12 ${
            flip ? 'md:order-2' : ''
          }`}
        >
          <div className="relative h-[56%] max-h-[28rem] min-h-[14rem] w-[58%] max-w-[22rem] overflow-hidden rounded-2xl border border-white/20 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.55)]">
            <Image
              src={service.image}
              alt={service.alt}
              fill
              /* The frame is ~25% of a half-column, so never ask for 50vw. */
              sizes="(min-width: 768px) 20vw, 62vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* ── Copy, over a graded scrim ─────────────────────────────────── */}
        <div
          className={`relative flex items-center px-6 py-20 lg:px-12 ${
            flip ? 'md:order-1' : ''
          }`}
        >
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${
              /* Both grade to their OUTER edge, so the pair mirrors: heaviest
                 at the page margin, lightest where the copy meets the
                 photograph, which keeps the join between the halves soft. */
              flip
                ? 'bg-gradient-to-l from-black/42 via-black/56 to-black/70'
                : 'bg-gradient-to-r from-black/42 via-black/56 to-black/70'
            }`}
          />

          <div className="relative z-10 mx-auto w-full max-w-xl">
            {header}

            <RevealGroup>
              {/* The marks carry currentColor — on the old sage card face they
                  inherited white, and they do the same here. */}
              <RevealItem>
                <div className="text-white">{Icon}</div>
              </RevealItem>

              <RevealItem className="mt-6">
                <h3 className="font-serif text-4xl font-normal leading-tight text-white md:text-5xl">
                  {service.title}
                </h3>
              </RevealItem>

              {/* Short rule between the name and the description */}
              <RevealItem className="mt-6">
                <span aria-hidden="true" className="block h-px w-16 bg-white/50" />
              </RevealItem>

              <RevealItem className="mt-6">
                <p className="font-sans text-lg leading-relaxed text-white">
                  {service.cardBody}
                </p>
              </RevealItem>

              <RevealItem className="mt-8">
                <AnimatedLink
                  href={`/${service.slug}`}
                  arrow
                  scale={false}
                  className="inline-flex items-center font-sans text-sm text-white underline underline-offset-4 transition-colors duration-300 hover:text-white/80"
                >
                  Read More
                </AnimatedLink>
              </RevealItem>
            </RevealGroup>

            {footer}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   The section-level copy that used to sit above and below the card grid.

   It is not card content, so it has nowhere of its own to live now that the
   grid is gone: the heading rides into the first service (Ayurveda) and the
   calls to action close out the last (Yoga). Both are passed in as slots so
   ServiceSection itself stays a plain "one service, one screen" component.

   Strings are unchanged from the grid version. Only the colours move, from the
   dark tokens to light ones, because they now sit on the same dark scrim as
   the rest of the copy in that half.
   ────────────────────────────────────────────────────────────────────────── */

export function ServicesHeader() {
  return (
    <RevealGroup className="mb-12">
      {/* Both headings on this page open with "Rooted in tradition." — the
          eyebrow is what tells them apart before the second line lands. */}
      <RevealItem>
        <p className="mb-4 font-sans text-sm uppercase tracking-[0.25em] text-white/90">
          Our Services
        </p>
      </RevealItem>

      <RevealItem>
        <h2 className="font-serif text-3xl font-normal leading-tight text-white md:text-4xl">
          Rooted in tradition.
          <br />
          Designed for your life.
        </h2>
      </RevealItem>

      <RevealItem className="mt-5">
        <p className="font-sans text-base leading-relaxed text-white">
          AyurshuddhiWellness is a few words about holistic meditation and improve your mind, with organic set of treatments.
        </p>
      </RevealItem>
    </RevealGroup>
  )
}

export function ServicesCTA() {
  return (
    <RevealGroup className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
      <RevealItem>
        <AnimatedLink
          href="#contact"
          arrow
          className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
        >
          Book Now
        </AnimatedLink>
      </RevealItem>

      {/* The three pillars are the headline offerings — the rest live on /services */}
      <RevealItem>
        <AnimatedLink
          href="/services"
          arrow
          scale={false}
          className="inline-flex items-center font-sans text-sm text-white underline underline-offset-4 transition-colors duration-300 hover:text-white/80"
        >
          Explore more services
        </AnimatedLink>
      </RevealItem>
    </RevealGroup>
  )
}

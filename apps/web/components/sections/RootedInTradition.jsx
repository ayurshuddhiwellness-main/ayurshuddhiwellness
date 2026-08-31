import { RevealGroup, RevealItem } from '../ui/Reveal'
import AnimatedLink from '../ui/AnimatedLink'
import ServiceCard from '../ui/ServiceCard'
import { SERVICE_ICONS } from '../ui/serviceIcons'
import { SERVICES } from '../../lib/services'

/* ──────────────────────────────────────────────────────
   The homepage's services section.

   Carries the three headline offerings, drawn from the same catalogue that
   feeds /services so the copy and imagery never drift apart. The full nine
   stay on /services, one link away.
   ────────────────────────────────────────────────────── */

const PILLAR_SLUGS = ['ayurveda', 'panchakarma', 'yoga-pranayama-meditation']

const PILLARS = PILLAR_SLUGS.map((slug) =>
  SERVICES.find((service) => service.slug === slug),
)

export default function RootedInTradition() {
  return (
    <section
      id="services"
      data-snap-section
      /* scroll-mt-16 clears the 64px sticky navbar when arriving via /#services.
         motion-safe:min-h-screen is the snap sequence's doing, not the layout's:
         it gives the section a full viewport to be stepped onto, and stays a
         minimum so long content grows rather than being clipped. Under reduced
         motion the lock is off, so the section sizes to its content as before.

         No border-t. That hairline divided this white slab from the card-toned
         one above it, back when each section painted its own ground. They are
         all transparent over one shared photograph now, so there are no two
         surfaces to separate and the border only drew a 1px linen line across
         the picture. */
      className="scroll-mt-16 flex flex-col justify-center px-6 py-24 motion-safe:min-h-screen lg:px-12"
    >
      <div className="mx-auto max-w-content">
        <RevealGroup className="mx-auto max-w-xl text-center">
          {/* Both headings on this page open with "Rooted in tradition." — the
              eyebrow is what tells them apart before the second line lands. */}
          <RevealItem>
            <p className="mb-4 font-sans text-sm uppercase tracking-[0.25em] text-primary">
              Our Services
            </p>
          </RevealItem>

          <RevealItem>
            <h2 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl">
              Rooted in tradition.
              <br />
              Designed for your life.
            </h2>
          </RevealItem>

          <RevealItem className="mt-6">
            <p className="font-sans text-lg leading-relaxed text-muted">
              AyurshuddhiWellness is a few words about holistic meditation and improve your mind, with organic set of treatments.
            </p>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((service) => (
            <RevealItem key={service.slug}>
              <ServiceCard
                title={service.title}
                body={service.cardBody}
                image={service.image}
                alt={service.alt}
                icon={SERVICE_ICONS[service.slug]}
                imageFit={service.imageFit}
                href={`/${service.slug}`}
              />
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
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
              className="inline-flex items-center font-sans text-sm text-foreground underline underline-offset-4 transition-colors duration-300 hover:text-primary"
            >
              Explore more services
            </AnimatedLink>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}

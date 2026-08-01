import { RevealGroup, RevealItem } from '../ui/Reveal'
import ServiceCard from '../ui/ServiceCard'
import { SERVICE_ICONS } from '../ui/serviceIcons'
import { SERVICES } from '../../lib/services'

/* ──────────────────────────────────────────────────────
   The full catalogue behind the homepage's three pillars.
   Copy and imagery live in lib/services.js, shared with
   the per-service routes; the marks live in ui/serviceIcons,
   shared with the homepage's three-pillar grid.
   ────────────────────────────────────────────────────── */

export default function ServicesGrid() {
  return (
    <section className="bg-background px-6 pb-24 pt-32 lg:px-12">
      <div className="mx-auto max-w-content">
        <RevealGroup className="mx-auto max-w-xl text-center">
          <RevealItem>
            <p className="mb-4 font-sans text-sm uppercase tracking-[0.25em] text-primary">
              Our Services
            </p>
          </RevealItem>
          <RevealItem>
            <h2 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl">
              Care for every layer of you.
            </h2>
          </RevealItem>
          <RevealItem className="mt-6">
            <p className="font-sans text-lg leading-relaxed text-muted">
              Nine practices drawn from Ayurveda and naturopathy — chosen to meet
              you where you are.
            </p>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <RevealItem key={service.slug}>
              <ServiceCard
                title={service.title}
                body={service.cardBody}
                image={service.image}
                alt={service.alt}
                icon={SERVICE_ICONS[service.slug]}
                imageFit={service.imageFit}
                href={`/${service.slug}`}
                /* First row is above the fold on desktop */
                priority={i < 3}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

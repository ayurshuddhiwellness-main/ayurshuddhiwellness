import { RevealGroup, RevealItem } from '../ui/Reveal'
import SectionScrim from '../ui/SectionScrim'
import ServiceCard from '../ui/ServiceCard'
import { EYEBROW, HEADING, BODY } from '../ui/surfaces'
import { SERVICE_ICONS } from '../ui/serviceIcons'
import { SERVICES } from '../../lib/services'

/* ──────────────────────────────────────────────────────
   The full catalogue behind the homepage's three pillars.
   Copy and imagery live in lib/services.js, shared with
   the per-service routes; the marks live in ui/serviceIcons,
   shared with the homepage's three-pillar grid.

   The linen slab this used to paint is gone: the page now sits on the site
   photograph, so the heading reads off a centred scrim and the cards carry
   their own translucent ground. The picture stays visible between them.
   ────────────────────────────────────────────────────── */

export default function ServicesGrid() {
  return (
    <section className="relative px-6 pb-24 pt-32 lg:px-12">
      <SectionScrim focus="center" />

      <div className="relative z-10 mx-auto max-w-content">
        <RevealGroup className="mx-auto max-w-xl text-center">
          <RevealItem>
            <p className={`mb-4 ${EYEBROW}`}>Our Services</p>
          </RevealItem>
          <RevealItem>
            {/* h1, not h2: this section is only ever rendered by /services, and
                that route had no h1 at all — its outline started at h2, so the
                page announced no title. The tag is the only change; h1/h2/h3
                share a face in globals.css and every size here is in the
                className, so nothing moves. */}
            <h1 className={`${HEADING} text-4xl md:text-5xl`}>Care for every layer of you.</h1>
          </RevealItem>
          <RevealItem className="mt-6">
            <p className={`${BODY} text-lg`}>
              Nine practices drawn from Ayurveda and naturopathy — chosen to meet you where you are.
            </p>
          </RevealItem>
        </RevealGroup>

        {/* The whole catalogue — all nine. (The homepage features three of
            them as full-screen sections; a card here is its own shape.) */}
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

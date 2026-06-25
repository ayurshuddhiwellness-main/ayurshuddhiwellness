import { RevealGroup, RevealItem } from '../ui/Reveal'
import AnimatedLink from '../ui/AnimatedLink'

export default function Journal() {
  return (
    <section className="bg-white px-6 py-24 lg:px-12">
      <div className="mx-auto grid max-w-content items-center gap-12 md:grid-cols-12 md:gap-0">
        {/* Left — text content */}
        <RevealGroup className="md:col-span-7 md:pr-20">
          <RevealItem>
            <p className="mb-4 font-sans text-sm uppercase tracking-[0.25em] text-muted">
              From the Journal
            </p>
          </RevealItem>

          <RevealItem>
            <h2 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl">
              Rooted in tradition.
              <br />
              Written for the curious.
            </h2>
          </RevealItem>

          <RevealItem className="mt-6">
            <p className="max-w-sm font-sans text-base leading-relaxed text-muted">
              Explore ancient Ayurvedic wisdom through modern stories — seasonal
              rituals, herbal spotlights, and guides to mindful living.
            </p>
          </RevealItem>

          <RevealItem className="mt-8">
            <AnimatedLink
              href="#"
              arrow
              className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
            >
              Read more
            </AnimatedLink>
          </RevealItem>
        </RevealGroup>

        {/* Right — blog card */}
        <RevealGroup className="md:col-span-5">
          <RevealItem>
            <div className="overflow-hidden rounded-2xl border border-border bg-background">
              {/* Journal label bar */}
              <div className="bg-background px-5 py-2.5">
                <span className="font-sans text-xs uppercase tracking-widest text-muted">
                  Journal
                </span>
              </div>

              {/* Image placeholder */}
              <div className="flex aspect-[16/10] items-center justify-center bg-[#E8E4DD]">
                <span className="font-sans text-sm text-muted">
                  Blog post image
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="font-sans text-xs uppercase tracking-widest text-primary">
                  Sample post
                </span>
                <h3 className="mt-2 font-serif text-lg font-normal leading-snug text-foreground">
                  The Morning Ritual: How Dinacharya Transforms Your Day
                </h3>
                <AnimatedLink
                  href="#"
                  arrow
                  scale={false}
                  className="mt-4 inline-flex items-center font-sans text-sm text-primary underline underline-offset-4 transition-colors duration-300 hover:text-primary-hover"
                >
                  Read more
                </AnimatedLink>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}

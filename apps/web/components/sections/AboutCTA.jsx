import { RevealGroup, RevealItem } from '../ui/Reveal'
import AnimatedLink from '../ui/AnimatedLink'

export default function AboutCTA() {
  return (
    <section className="bg-primary px-6 py-20 lg:px-12">
      <RevealGroup className="mx-auto max-w-content text-center">
        <RevealItem>
          <h2 className="font-serif text-3xl font-normal text-white md:text-4xl">
            Ready to meet us?
          </h2>
        </RevealItem>

        <RevealItem className="mt-4">
          <p className="mx-auto max-w-lg font-sans text-base leading-relaxed text-white/70">
            Schedule a consultation and experience Ayurveda tailored to you.
          </p>
        </RevealItem>

        <RevealItem className="mt-8">
          <AnimatedLink
            href="#contact"
            className="inline-flex items-center rounded-full bg-white px-8 py-3 font-sans text-sm font-medium text-primary transition-colors duration-300 hover:bg-white/90"
          >
            Book a Consultation →
          </AnimatedLink>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}

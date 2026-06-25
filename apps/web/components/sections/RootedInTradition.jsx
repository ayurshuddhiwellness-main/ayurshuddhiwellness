import { RevealGroup, RevealItem } from '../ui/Reveal'
import AnimatedLink from '../ui/AnimatedLink'

export default function RootedInTradition() {
  return (
    <section id="about" className="bg-white px-6 py-24 lg:px-12">
      <div className="mx-auto grid max-w-content items-center gap-12 md:grid-cols-12 md:gap-0">
        {/* Left — product image placeholder */}
        <RevealGroup className="md:col-span-7">
          <RevealItem>
            <div className="flex aspect-[3/4] max-h-[600px] items-center justify-center rounded-2xl bg-[#E8E4DD]">
              <span className="font-sans text-sm text-muted">Apothecary product image</span>
            </div>
          </RevealItem>
        </RevealGroup>

        {/* Right — text content */}
        <RevealGroup className="md:col-span-5 md:pl-20">
          <RevealItem>
            <h2 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl">
              Rooted in tradition.
              <br />
              Designed for your life.
            </h2>
          </RevealItem>

          <RevealItem className="mt-6">
            <p className="max-w-sm font-sans text-base leading-relaxed text-muted">
              AyurshuddhiWellness is a few words about holistic meditation and improve your mind, with organic set of treatments.
            </p>
          </RevealItem>

          <RevealItem className="mt-8">
            <div className="flex items-center gap-6">
              <AnimatedLink
                href="#contact"
                arrow
                className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
              >
                Book Now
              </AnimatedLink>
              <AnimatedLink
                href="#"
                arrow
                scale={false}
                className="inline-flex items-center font-sans text-sm text-foreground underline underline-offset-4 transition-colors duration-300 hover:text-primary"
              >
                Read more
              </AnimatedLink>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}

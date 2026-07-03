import { RevealGroup, RevealItem } from '../../ui/Reveal'

export default function JournalHeader() {
  return (
    <section className="bg-background px-6 py-20 lg:px-12">
      <RevealGroup className="mx-auto max-w-content">
        <RevealItem>
          <p className="mb-5 font-sans text-sm uppercase tracking-[0.25em] text-primary">
            The Blog
          </p>
        </RevealItem>
        <RevealItem>
          <h1 className="max-w-2xl font-serif text-5xl font-normal leading-tight text-foreground md:text-6xl">
            Stories of healing.
          </h1>
        </RevealItem>
        <RevealItem>
          <p className="mt-6 max-w-lg font-sans text-lg leading-relaxed text-muted">
            Reflections on Ayurvedic wisdom, seasonal rituals, and the quiet art
            of mindful living — written to be read slowly.
          </p>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}

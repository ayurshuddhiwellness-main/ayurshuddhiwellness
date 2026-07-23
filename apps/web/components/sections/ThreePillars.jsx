import { RevealGroup, RevealItem } from '../ui/Reveal'

const pillars = [
  {
    title: 'Ayurveda',
    description:
      'Five-thousand-year-old healing science that restores balance through personalised herbal formulations, dietary guidance, and lifestyle rituals.',
    icon: (
      // Leaf icon
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 4 20 4s0 4.5-2 10.1A7 7 0 0 1 11 20z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  },
  {
    title: 'Panchakarma',
    description:
      'Classical five-fold Ayurvedic detoxification therapy that deeply purifies tissues, removes accumulated toxins, and rejuvenates the entire body.',
    icon: (
      // Water-drop icon
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  {
    title: 'Yoga & Meditation',
    description:
      'Mind-body disciplines that cultivate inner stillness, build physical strength, and awaken a deeper awareness for lasting well-being.',
    icon: (
      // Lotus icon
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M12 20c0-4-3.5-7.5-7.5-7.5S12 5 12 5s7.5 3 7.5 7.5S12 20 12 20z" />
        <path d="M12 20c0-4 3.5-7.5 7.5-7.5" />
        <path d="M12 20c0-4-3.5-7.5-7.5-7.5" />
        <path d="M12 5c-1.5 2-2 4.5-2 7" />
        <path d="M12 5c1.5 2 2 4.5 2 7" />
      </svg>
    ),
  },
]

export default function ThreePillars() {
  return (
    <section className="bg-background px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-content">
        <RevealGroup>
          <RevealItem>
            <h2 className="font-serif text-4xl font-normal text-foreground">
              3 Pillars
            </h2>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <RevealItem key={pillar.title} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-white p-8 transition-shadow duration-300 hover:shadow-soft">
                <div className="mb-6">{pillar.icon}</div>
                <h3 className="font-serif text-xl text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-muted">
                  {pillar.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

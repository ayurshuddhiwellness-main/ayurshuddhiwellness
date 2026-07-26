import { RevealGroup, RevealItem } from '../ui/Reveal'

/* ──────────────────────────────────────────────────────
   The full catalogue behind the homepage's three pillars.
   Informational only — pricing and booking live at /book.
   ────────────────────────────────────────────────────── */

const iconProps = {
  width: 40,
  height: 40,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'text-primary',
}

const SERVICES = [
  {
    title: 'Ayurveda',
    body: 'Personalised herbal formulations, diet, and daily rhythm, prescribed to your own constitution.',
    icon: (
      // Leaf
      <svg {...iconProps}>
        <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 4 20 4s0 4.5-2 10.1A7 7 0 0 1 11 20z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  },
  {
    title: 'Naturopathy',
    body: 'Healing drawn from the elements — water, earth, sunlight, and unhurried rest.',
    icon: (
      // Sun
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M4.93 19.07l1.41-1.41" />
        <path d="M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    title: 'Panchakarma',
    body: 'Classical five-fold purification that clears accumulated toxins and renews the tissues.',
    icon: (
      // Water drop
      <svg {...iconProps}>
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  {
    title: 'Pulse Diagnosis (Nadi Pariksha)',
    body: 'Reading the pulse to trace imbalance in the doshas long before symptoms surface.',
    icon: (
      // Pulse trace
      <svg {...iconProps}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: 'Tongue Diagnosis',
    body: 'The tongue reveals digestion, accumulation, and the state of your inner terrain.',
    icon: (
      // Tongue
      <svg {...iconProps}>
        <path d="M12 3c-3.9 0-6 2.4-6 5.9 0 5 2.4 12.1 6 12.1s6-7.1 6-12.1C18 5.4 15.9 3 12 3z" />
        <path d="M12 7.5v11" />
      </svg>
    ),
  },
  {
    title: 'Rakht Mokshan and Leech Therapy',
    body: 'Gentle bloodletting, an age-old remedy for skin conditions and stagnant circulation.',
    icon: (
      // Leech + drop
      <svg {...iconProps}>
        <path d="M4 21c0-6.5 3.2-11 7.5-12.1 2.7-.7 4.5.8 4.5 2.9 0 2.2-2.1 3.4-3.8 2.5" />
        <path d="M19 2.5c1.3 1.8 2 2.9 2 3.9a2 2 0 0 1-4 0c0-1 .7-2.1 2-3.9z" />
      </svg>
    ),
  },
  {
    title: 'Agni Karma',
    body: 'Precise thermal cautery from classical surgery, used to quiet persistent joint pain.',
    icon: (
      // Flame
      <svg {...iconProps}>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
  {
    title: 'Yoga, Pranayama, and Meditation',
    body: 'Movement, breath, and stillness practised together to steady body and mind.',
    icon: (
      // Lotus
      <svg {...iconProps}>
        <path d="M12 20c0-4-3.5-7.5-7.5-7.5S12 5 12 5s7.5 3 7.5 7.5S12 20 12 20z" />
        <path d="M12 20c0-4 3.5-7.5 7.5-7.5" />
        <path d="M12 20c0-4-3.5-7.5-7.5-7.5" />
        <path d="M12 5c-1.5 2-2 4.5-2 7" />
        <path d="M12 5c1.5 2 2 4.5 2 7" />
      </svg>
    ),
  },
  {
    title: 'Depression and Stress Management',
    body: 'Sattvic routine, herbs, and breathwork to restore calm and lift the spirit.',
    icon: (
      // Crescent moon
      <svg {...iconProps}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
]

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
          {SERVICES.map((service) => (
            <RevealItem key={service.title} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-white p-8 transition-shadow duration-300 hover:shadow-soft">
                <div className="mb-6">{service.icon}</div>
                <h3 className="font-serif text-xl text-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-muted">
                  {service.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

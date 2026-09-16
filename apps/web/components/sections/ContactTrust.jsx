'use client'

import { RevealGroup, RevealItem } from '../ui/Reveal'
import SectionScrim from '../ui/SectionScrim'
import { PANEL_SOFT, PANEL_SOFT_BG, BODY } from '../ui/surfaces'

const iconProps = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'text-white/80',
  'aria-hidden': 'true',
}

const REASONS = [
  {
    title: 'BAMS Certified',
    body: 'Our practitioners hold verified BAMS degrees with years of clinical experience.',
    icon: (
      // Seal
      <svg {...iconProps}>
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 14.5 7 22l5-2.5L17 22l-1.5-7.5" />
      </svg>
    ),
  },
  {
    title: 'Personalised Care',
    body: 'Every treatment plan is customised to your unique Prakriti and wellness goals.',
    icon: (
      // Three doshas
      <svg {...iconProps}>
        <circle cx="12" cy="8.5" r="5" />
        <circle cx="7.5" cy="15.5" r="5" />
        <circle cx="16.5" cy="15.5" r="5" />
      </svg>
    ),
  },
  {
    title: '5,000+ Clients',
    body: 'Trusted by thousands of individuals on their wellness journey.',
    icon: (
      // Two figures
      <svg {...iconProps}>
        <path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
        <circle cx="9" cy="7" r="3.5" />
        <path d="M22 20v-1.5a4 4 0 0 0-3-3.87" />
        <path d="M16.5 3.63a4 4 0 0 1 0 7.24" />
      </svg>
    ),
  },
]

export default function ContactTrust() {
  return (
    <section className="relative px-6 pb-24 lg:px-12 lg:pb-32">
      <SectionScrim focus="center" />

      <div className="relative z-10 mx-auto max-w-content">
        <RevealGroup className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {REASONS.map((reason) => (
            <RevealItem key={reason.title} className="h-full">
              <article
                style={{ background: PANEL_SOFT_BG }}
                className={`h-full ${PANEL_SOFT} p-8 transition-colors duration-300 hover:border-white/35`}
              >
                {reason.icon}

                <h3 className="mt-6 font-sans text-xs uppercase tracking-[0.25em] text-white/75">
                  {reason.title}
                </h3>

                <p className={`mt-4 ${BODY} text-base`}>{reason.body}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

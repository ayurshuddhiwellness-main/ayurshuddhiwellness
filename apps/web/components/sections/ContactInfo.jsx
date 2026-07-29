'use client'

import { RevealGroup, RevealItem } from '../ui/Reveal'

/* Contact details are the same ones the Footer carries. Icons match the
   Footer's set — 16x16, currentColor, 1.5 stroke. */

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'mt-1 shrink-0 text-primary',
  'aria-hidden': 'true',
}

const ADDRESS = 'A-228 Sector 36, Greater Noida, UP 201310'

const DETAILS = [
  {
    label: 'Phone',
    value: '+91 8510049114',
    href: 'tel:+918510049114',
    icon: (
      <svg {...iconProps}>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'ayurshuddhiwellness@gmail.com',
    href: 'mailto:ayurshuddhiwellness@gmail.com',
    icon: (
      <svg {...iconProps}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: 'Visit',
    value: ADDRESS,
    icon: (
      <svg {...iconProps}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
]

const HOURS = [
  { days: 'Monday – Saturday', time: '9:00 AM – 7:00 PM' },
  { days: 'Sunday', time: '10:00 AM – 2:00 PM' },
]

export default function ContactInfo() {
  return (
    <RevealGroup>
      <RevealItem>
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary">
          Find Us
        </p>
      </RevealItem>

      <RevealItem className="mt-8">
        <ul className="flex flex-col gap-6">
          {DETAILS.map((detail) => (
            <li key={detail.label} className="flex items-start gap-4">
              {detail.icon}
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-muted">
                  {detail.label}
                </p>
                {detail.href ? (
                  <a
                    href={detail.href}
                    className="mt-1.5 block font-sans text-base text-foreground transition-colors duration-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  >
                    {detail.value}
                  </a>
                ) : (
                  <p className="mt-1.5 font-sans text-base text-foreground">
                    {detail.value}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </RevealItem>

      <RevealItem className="mt-10 border-t border-border pt-8">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-muted">
          Business Hours
        </p>
        <dl className="mt-4 flex flex-col gap-2">
          {HOURS.map((h) => (
            <div
              key={h.days}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
            >
              <dt className="font-sans text-sm text-foreground">{h.days}</dt>
              <dd className="font-sans text-sm tabular-nums text-muted">
                {h.time}
              </dd>
            </div>
          ))}
        </dl>
      </RevealItem>

      <RevealItem className="mt-10">
        <div className="overflow-hidden rounded-card border border-border">
          <iframe
            title={`Map showing AyurshuddhiWellness at ${ADDRESS}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
            width="100%"
            height="300"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block border-0"
          />
        </div>
      </RevealItem>
    </RevealGroup>
  )
}

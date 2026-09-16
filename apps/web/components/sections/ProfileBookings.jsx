'use client'

import { RevealGroup, RevealItem } from '../ui/Reveal'
import SectionScrim from '../ui/SectionScrim'
import { EYEBROW, HEADING, PANEL_CREAM, PANEL_CREAM_BG, LINK } from '../ui/surfaces'
import AnimatedLink from '../ui/AnimatedLink'
import { BOOKINGS } from '../../lib/profile-mock'

/* Status pills stay outlined rather than filled — a row of solid blocks reads
   louder than this page wants. #B85C5C is the earthy error tone from
   DESIGN_SYSTEM_3.md; it has no Tailwind token, so it is set as an arbitrary
   value here and in the account actions below. */
const STATUS = {
  confirmed: { label: 'Confirmed', className: 'border-primary text-primary' },
  completed: { label: 'Completed', className: 'border-border text-muted' },
  cancelled: {
    label: 'Cancelled',
    className: 'border-[#B85C5C] text-[#B85C5C]',
  },
}

const ACTIONS = [
  { label: 'Change Password', href: '/login' },
  { label: 'Notification Preferences', href: '/profile' },
]

export default function ProfileBookings() {
  return (
    <section className="relative px-6 pb-24 lg:px-12 lg:pb-32">
      <SectionScrim focus="left" />

      <div className="mx-auto max-w-content">
        <RevealGroup>
          <RevealItem>
            <p className={`mb-4 ${EYEBROW}`}>Appointments</p>
          </RevealItem>
          <RevealItem>
            <h2 className={`${HEADING} text-3xl md:text-4xl`}>Your Appointments</h2>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="mt-10 flex flex-col gap-4">
          {BOOKINGS.map((booking) => {
            const status = STATUS[booking.status]

            return (
              <RevealItem key={booking.id}>
                <article
                  style={{ background: PANEL_CREAM_BG }}
                  className={`flex flex-col gap-4 ${PANEL_CREAM} p-6 transition-colors duration-300 md:flex-row md:items-center md:justify-between md:p-7`}
                >
                  <div>
                    <h3 className="font-sans text-base font-medium text-foreground">
                      {booking.service}
                    </h3>
                    <p className="mt-1.5 font-sans text-sm text-muted">
                      {booking.date} &middot; {booking.time}
                    </p>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full border px-3 py-1 font-sans text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </article>
              </RevealItem>
            )
          })}

          <RevealItem className="mt-4">
            <AnimatedLink
              href="/book"
              arrow
              className="inline-flex items-center rounded-full bg-primary px-8 py-3 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Book New Appointment
            </AnimatedLink>
          </RevealItem>
        </RevealGroup>

        {/* Account actions */}
        <RevealGroup className="relative z-10 mt-16 border-t border-white/20 pt-8">
          <RevealItem>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {ACTIONS.map((action) => (
                <AnimatedLink key={action.label} href={action.href} scale={false} className={LINK}>
                  {action.label}
                </AnimatedLink>
              ))}

              <AnimatedLink
                href="/login"
                scale={false}
                className="font-sans text-sm text-[#B85C5C] underline underline-offset-4 transition-opacity duration-300 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B85C5C] focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                Log Out
              </AnimatedLink>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}

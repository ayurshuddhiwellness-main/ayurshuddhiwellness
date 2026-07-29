'use client'

import { RevealGroup, RevealItem } from '../ui/Reveal'
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
    <section className="bg-background px-6 pb-24 lg:px-12 lg:pb-32">
      <div className="mx-auto max-w-content">
        <RevealGroup>
          <RevealItem>
            <p className="mb-4 font-sans text-sm uppercase tracking-[0.25em] text-primary">
              Appointments
            </p>
          </RevealItem>
          <RevealItem>
            <h2 className="font-serif text-3xl font-normal leading-tight text-foreground md:text-4xl">
              Your Appointments
            </h2>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="mt-10 flex flex-col gap-4">
          {BOOKINGS.map((booking) => {
            const status = STATUS[booking.status]

            return (
              <RevealItem key={booking.id}>
                <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-colors duration-300 hover:border-primary md:flex-row md:items-center md:justify-between md:p-7">
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
        <RevealGroup className="mt-16 border-t border-border pt-8">
          <RevealItem>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {ACTIONS.map((action) => (
                <AnimatedLink
                  key={action.label}
                  href={action.href}
                  scale={false}
                  className="font-sans text-sm text-muted underline underline-offset-4 transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
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

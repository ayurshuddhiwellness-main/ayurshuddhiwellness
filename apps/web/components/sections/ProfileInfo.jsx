'use client'

import { RevealGroup, RevealItem } from '../ui/Reveal'
import AnimatedLink from '../ui/AnimatedLink'
import { PROFILE } from '../../lib/profile-mock'

const FIELDS = [
  { label: 'Full Name', value: PROFILE.name },
  { label: 'Email', value: PROFILE.email },
  { label: 'Phone', value: PROFILE.phone },
  { label: 'Date of Birth', value: PROFILE.dob },
  { label: 'Gender', value: PROFILE.gender },
]

export default function ProfileInfo() {
  return (
    <section className="bg-background px-6 pb-16 lg:px-12">
      <RevealGroup className="mx-auto max-w-content">
        <RevealItem>
          <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-normal text-foreground">
                Personal Information
              </h2>

              <AnimatedLink
                href="/profile"
                className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Edit Profile
              </AnimatedLink>
            </div>

            <dl className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.label}>
                  <dt className="font-sans text-xs uppercase tracking-[0.25em] text-muted">
                    {field.label}
                  </dt>
                  <dd className="mt-2 font-sans text-base text-foreground">
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
